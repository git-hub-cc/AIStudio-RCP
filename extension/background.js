// background.js

let ws;
let reconnectInterval = 5000; // 初始重连间隔为 5 秒
let config = {};
let connectionStatus = 'disconnected'; // 连接状态

// 默认配置
const DEFAULTS = {
    serverUrl: 'ws://localhost:8080',
    agentId: `agent-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    token: 'your-super-secret-token-123'
};

// =================================================================
// AI 助手相关常量和辅助函数
// =================================================================
const AI_STUDIO_URL = 'https://aistudio.google.com/prompts/new_chat';
const PAGE_LOAD_TIMEOUT = 10000; // 页面加载或操作的通用超时时间：10秒
const AI_RESPONSE_TIMEOUT = 300000; // 等待AI响应的超时时间：300秒

/**
 * 等待指定标签页加载完成。
 * @param {number} tabId - 目标标签页的ID。
 * @returns {Promise<void>} - 当页面加载完成时 resolve。
 */
function waitForTabLoad(tabId) {
    return new Promise((resolve, reject) => {
        // 设置超时，防止页面一直无法加载完成
        const timeout = setTimeout(() => {
            chrome.tabs.onUpdated.removeListener(listener);
            reject(new Error(`页面加载超时 (${PAGE_LOAD_TIMEOUT / 1000}秒)`));
        }, PAGE_LOAD_TIMEOUT);

        const listener = (updatedTabId, changeInfo) => {
            if (updatedTabId === tabId && changeInfo.status === 'complete') {
                clearTimeout(timeout);
                chrome.tabs.onUpdated.removeListener(listener);
                // 额外等待一小段时间，确保页面上的JS初始化脚本完全执行完毕
                setTimeout(resolve, 500);
            }
        };
        chrome.tabs.onUpdated.addListener(listener);
    });
}

/**
 * 在指定标签页中安全地执行脚本。
 * @param {number} tabId - 目标标签页的ID。
 * @param {Function} func - 要执行的函数。
 * @param {Array} args - 传递给函数的参数数组。
 * @returns {Promise<any>} - 返回脚本的执行结果。
 */
async function executeScriptInTab(tabId, func, args) {
    try {
        const result = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: func,
            args: args,
        });
        // executeScript 返回一个数组，通常我们只需要第一个结果
        if (result && result.length > 0) {
            return result[0].result;
        }
        return undefined;
    } catch (error) {
        console.error("脚本执行失败:", error);
        // 尝试从 error.message 中提取更具体的原因，特别是 Promise aection 时的信息
        let errorMessage = error.message;
        if (error.message.includes("Error: ")) {
            errorMessage = error.message.split("Error: ")[1];
        }
        throw new Error(`在目标页面执行脚本时失败: ${errorMessage}`);
    }
}


/**
 * 【核心优化】解析AI Studio返回的复杂JSON流数据。
 * 此函数能处理多行、深度嵌套的JSON数组，并通过识别中文字符来精确提取最终答案，
 * 同时过滤掉AI的英文思考过程元数据。
 * @param {string} responseBody - 从网络请求中获取的原始响应体字符串。
 * @returns {string} - 解析、过滤并重组后的AI回答文本。
 */
function parseAiResponse(responseBody) {
    try {
        // 步骤 1: 聚合所有行的数据
        // AI Studio的响应是多行JSON片段，我们需要将它们全部解析并聚合。
        const aggregatedData = [];
        const lines = responseBody.split('\n');
        for (const line of lines) {
            if (line.trim()) { // 忽略空行
                try {
                    // 每一行都应该是一个独立的JSON片段（通常是数组）
                    aggregatedData.push(JSON.parse(line));
                } catch (e) {
                    console.warn("跳过无法解析为JSON的行:", line);
                }
            }
        }

        // 步骤 2: 递归遍历聚合后的数据，智能过滤并提取文本片段
        const textFragments = [];
        // 使用Unicode属性转义来可靠地检测中文字符
        const hasChinese = /[\p{Script=Han}]/u;

        function traverse(node) {
            if (Array.isArray(node)) {
                for (const item of node) {
                    traverse(item);
                }
            } else if (typeof node === 'string') {
                // 关键过滤条件：只保留包含中文字符的非空字符串。
                // 这能有效排除英文的思考链、标签、ID等元数据。
                if (node.trim() && hasChinese.test(node)) {
                    textFragments.push(node);
                }
            }
        }

        traverse(aggregatedData);

        // 步骤 3: 智能拼接并进行最终格式化
        if (textFragments.length === 0) {
            // 如果找不到中文，作为备选方案，返回原始响应体给用户判断
            console.warn("在响应中未找到有效的中文回答文本，将返回原始响应体。");
            return responseBody;
        }

        // 将所有片段无缝连接，以正确合并被切分的句子
        let combinedText = textFragments.join('');
        // 移除开头和结尾可能的多余空白
        combinedText = combinedText.trim();
        // （可选）规范化段落间距，防止过多空行
        combinedText = combinedText.replace(/\n{3,}/g, '\n\n');

        return combinedText;

    } catch (e) {
        console.error("解析AI响应失败:", e);
        // 在解析失败时打印原始响应体，这对于调试至关重要
        console.error("原始响应体:", responseBody);
        throw new Error(`解析AI响应失败: ${e.message}`);
    }
}


/**
 * 【核心优化函数】
 * 使用 Debugger API 准确等待并捕获 AI 的响应。
 * 通过关联 requestWillBeSent 和 responseReceived 事件，确保只捕获POST方法的正确请求。
 * @param {number} tabId - 目标标签页的ID。
 * @returns {Promise<string>} - 返回AI的回答文本。
 */
function waitForAiResponse(tabId) {
    return new Promise(async (resolve, reject) => {
        const debuggerTarget = { tabId };
        let timeoutId = null;
        let targetRequestId = null; // 状态变量：用于精确跟踪目标请求的ID
        const requestMethods = new Map(); // NEW: 用于存储 requestId -> method 的映射

        // 统一的清理函数，确保在任何情况下都能正确分离调试器和移除监听器
        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            requestMethods.clear(); // 清理映射
            // 使用 try-catch 包裹，防止因重复移除监听器或分离调试器而出错
            try {
                chrome.debugger.onEvent.removeListener(onDebuggerEvent);
                chrome.debugger.detach(debuggerTarget).catch(e => console.warn("分离调试器时出现警告:", e));
            } catch (e) {
                console.warn("清理调试器资源时出现警告:", e);
            }
        };

        // 调试器事件的核心处理函数
        const onDebuggerEvent = async (source, method, params) => {
            // 确保事件来自于我们正在监听的目标标签页
            if (source.tabId !== tabId) return;

            // 阶段一：在请求即将发送时，记录其请求方法
            if (method === 'Network.requestWillBeSent') {
                requestMethods.set(params.requestId, params.request.method);
            }

            // 阶段二：当收到响应头时，进行双重验证 (URL + Method)
            if (method === 'Network.responseReceived' && params.response.url.includes('GenerateContent')) {
                const requestMethod = requestMethods.get(params.requestId);

                // 只有当URL匹配且方法为POST时，才认为是我们的目标请求
                if (requestMethod === 'POST') {
                    console.log(`[Debugger] 拦截到AI响应头 (POST)，请求ID: ${params.requestId}`);
                    console.log(`路径: ${params.response.url}`);
                    targetRequestId = params.requestId; // 标记此请求ID为我们的追踪目标
                    requestMethods.delete(params.requestId); // 已识别，可从Map中移除
                }
            }

            // 阶段三：当目标请求完全加载完成后，获取其响应体
            if (method === 'Network.loadingFinished' && params.requestId === targetRequestId) {
                console.log(`[Debugger] 目标请求 (ID: ${targetRequestId}) 已完成加载，正在获取响应体...`);
                try {
                    const response = await chrome.debugger.sendCommand(debuggerTarget, "Network.getResponseBody", {
                        requestId: params.requestId
                    });

                    // START OF MODIFICATION: 先解析，后发送预览
                    // 步骤 1: 立即调用解析函数处理原始响应
                    const aiText = parseAiResponse(response.body);
                    console.log(`[Debugger] 已解析AI响应，准备发送预览。`);

                    // 步骤 2: 将处理过的、干净的文本发送给前端用于预览
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        const eventMessage = {
                            event: 'ai_response_preview',
                            fromAgentId: config.agentId,
                            payload: {
                                body: aiText, // 发送处理后的文本
                            }
                        };
                        ws.send(JSON.stringify(eventMessage));
                    }
                    // END OF MODIFICATION

                    console.log(`[Debugger] 成功获取并解析AI响应。`);
                    cleanup(); // 操作成功，执行清理
                    resolve(aiText); // 步骤 3: 使用同一个处理过的文本完成Promise
                } catch (error) {
                    console.error("[Debugger] 获取或解析响应体失败:", error);
                    cleanup(); // 操作失败，执行清理
                    reject(error); // 拒绝Promise
                }
            }
        };

        try {
            // 步骤1: 附加调试器到目标标签页
            await chrome.debugger.attach(debuggerTarget, "1.3");
            console.log(`[Debugger] 已成功附加到 Tab ID: ${tabId}`);

            // 步骤2: 注册事件监听器
            chrome.debugger.onEvent.addListener(onDebuggerEvent);

            // 步骤3: 启用网络事件域
            await chrome.debugger.sendCommand(debuggerTarget, "Network.enable");
            console.log("[Debugger] Network域已启用。");

            // 步骤4: 设置总超时，防止整个过程卡住
            timeoutId = setTimeout(() => {
                console.error(`[Debugger] 等待AI响应超时 (${AI_RESPONSE_TIMEOUT / 1000}秒)`);
                cleanup(); // 超时，执行清理
                reject(new Error(`等待AI响应超时 (${AI_RESPONSE_TIMEOUT / 1000}秒)`));
            }, AI_RESPONSE_TIMEOUT);

        } catch (error) {
            console.error(`[Debugger] 附加或启用调试器失败: ${error.message}`);
            cleanup(); // 初始设置失败，执行清理
            reject(new Error(`附加调试器失败: ${error.message}`));
        }
    });
}

/**
 * 更新扩展图标的徽章，以直观显示连接状态。
 */
async function updateBadge() {
    let text = '';
    let color = '#a0a0a0'; // 灰色
    switch (connectionStatus) {
        case 'connecting':
            text = '...';
            color = '#f5a623'; // 黄色
            break;
        case 'connected':
            text = 'ON';
            color = '#4caf50'; // 绿色
            break;
        case 'disconnected':
            text = 'OFF';
            color = '#f44336'; // 红色
            break;
    }
    await chrome.action.setBadgeText({ text });
    await chrome.action.setBadgeBackgroundColor({ color });
}

/**
 * 从 chrome.storage.local 加载配置。
 */
async function loadConfig() {
    const data = await chrome.storage.local.get(Object.keys(DEFAULTS));
    config = { ...DEFAULTS, ...data };
    console.log('配置已加载:', config);
}

/**
 * 连接到 WebSocket 服务器。
 */
function connect() {
    if (ws) return; // 如果已有连接，则不执行任何操作
    if (!config.serverUrl || !config.agentId || !config.token) {
        console.error('配置缺失，无法连接。请检查选项页面。');
        connectionStatus = 'disconnected';
        updateBadge();
        return;
    }

    const connectUrl = `${config.serverUrl}?type=agent&id=${config.agentId}&token=${config.token}`;
    console.log(`正在尝试连接到: ${connectUrl}`);
    connectionStatus = 'connecting';
    updateBadge();

    ws = new WebSocket(connectUrl);

    ws.onopen = () => {
        console.log('WebSocket 连接已成功建立。');
        connectionStatus = 'connected';
        updateBadge();
        reconnectInterval = 5000; // 连接成功后，重置重连间隔
    };

    ws.onmessage = async (event) => {
        console.log(`[接收] 收到命令: ${event.data}`);
        try {
            const command = JSON.parse(event.data);
            handleCommand(command);
        } catch (e) {
            console.error('解析收到的JSON命令失败:', e);
        }
    };

    ws.onclose = (event) => {
        console.log(`WebSocket 已断开。代码: ${event.code}, 原因: ${event.reason || '无'}. 将在 ${reconnectInterval / 1000} 秒后重试。`);
        ws = null;
        connectionStatus = 'disconnected';
        updateBadge();
        setTimeout(connect, reconnectInterval);
        // 实现指数退避策略，避免在服务器持续不可用时频繁重连
        reconnectInterval = Math.min(reconnectInterval * 2, 60000); // 最大间隔60秒
    };

    ws.onerror = (error) => {
        console.error('WebSocket 发生错误:', error);
        connectionStatus = 'disconnected';
        updateBadge();
        // 发生错误时，onclose事件通常也会被触发，所以重连逻辑由 onclose 处理
    };
}

/**
 * 处理从服务器接收到的命令。
 * @param {object} command - 解析后的命令对象。
 */
async function handleCommand(command) {
    const { id, action, payload } = command;
    try {
        let responseData = {};
        switch (action) {
            case 'create_tab':
                if (payload && payload.url) {
                    await chrome.tabs.create({ url: payload.url });
                    responseData = { message: `已成功创建URL为 ${payload.url} 的标签页。` };
                } else {
                    throw new Error('create_tab 的 payload 中缺少 url 参数');
                }
                sendResponse(id, 'success', responseData);
                break;

            case 'get_title':
                const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (activeTab) {
                    responseData = { title: activeTab.title, url: activeTab.url };
                } else {
                    throw new Error('未找到活动的标签页。');
                }
                sendResponse(id, 'success', responseData);
                break;

            case 'ask_ai':
                if (!payload || !payload.prompt) {
                    throw new Error('ask_ai 的 payload 中缺少 prompt 参数');
                }

                // 步骤 1: 查找或创建一个新的 AI Studio 标签页
                let [aiTab] = await chrome.tabs.query({ url: `${AI_STUDIO_URL}*` });
                if (aiTab) {
                    await chrome.tabs.update(aiTab.id, { active: true }); // 如果已存在，则激活它
                } else {
                    aiTab = await chrome.tabs.create({ url: AI_STUDIO_URL, active: true });
                    await waitForTabLoad(aiTab.id); // 等待新页面加载完成
                }
                const tabId = aiTab.id;

                // 步骤 2: 准备监听AI响应 (这是异步的，Promise立即返回)
                const aiResponsePromise = waitForAiResponse(tabId);

                // START OF MODIFICATION: 增强的脚本注入逻辑
                // 步骤 3: 注入一个健壮的脚本，该脚本会等待输入框出现，然后输入内容并触发送信。
                // 这个脚本会在目标页面内部执行，直到成功或超时。
                await executeScriptInTab(tabId, (prompt, timeout) => {
                    // 这个函数及其内部逻辑将在目标标签页的上下文中执行
                    return new Promise((resolve, reject) => {
                        const startTime = Date.now();
                        const selector = 'ms-autosize-textarea textarea';

                        const intervalId = setInterval(() => {
                            // 检查是否超时
                            if (Date.now() - startTime > timeout) {
                                clearInterval(intervalId);
                                reject(new Error(`在页面上等待输入框 ('${selector}') 超时 (${timeout / 1000}秒)`));
                                return;
                            }

                            const textarea = document.querySelector(selector);
                            // 如果找到了textarea
                            if (textarea) {
                                clearInterval(intervalId);

                                // 1. 填入内容
                                textarea.value = prompt;
                                // 2. 模拟输入事件，确保页面框架(如React, Angular)能识别内容变化
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));

                                // 3. 模拟 Ctrl+Enter 快捷键来发送消息
                                const event = new KeyboardEvent('keydown', {
                                    key: 'Enter',
                                    code: 'Enter',
                                    ctrlKey: true,
                                    bubbles: true,
                                    cancelable: true
                                });
                                textarea.dispatchEvent(event);

                                // 4. 操作完成，解决Promise
                                resolve();
                            }
                        }, 200); // 每200毫秒检查一次
                    });
                }, [payload.prompt, PAGE_LOAD_TIMEOUT]);
                // END OF MODIFICATION

                // 步骤 4: 等待之前启动的监听器捕获到AI的响应
                console.log("指令已发送，正在等待AI响应...");
                const aiResult = await aiResponsePromise;
                responseData = { answer: aiResult };
                sendResponse(id, 'success', responseData);
                break;

            default:
                throw new Error(`收到了未知的操作指令: ${action}`);
        }
    } catch (error) {
        console.error(`处理命令 '${action}' 时出错:`, error);
        sendResponse(id, 'error', null, error.message);
    }
}


/**
 * 向 WebSocket 服务器发送响应。
 * @param {string} requestId - 原始命令的ID。
 * @param {'success'|'error'} status - 响应状态。
 * @param {object|null} data - 成功时附带的数据。
 * @param {string} [errorMessage=''] - 失败时的错误信息。
 */
function sendResponse(requestId, status, data, errorMessage = '') {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn('无法发送响应，因为WebSocket连接未打开。');
        return;
    }
    const response = {
        response_to: requestId,
        status: status,
        fromAgentId: config.agentId
    };
    if (status === 'success') {
        response.data = data;
    } else {
        response.error_message = errorMessage;
    }
    const responseString = JSON.stringify(response);
    ws.send(responseString);
    console.log(`[发送] 已发送响应:`, response);
}

// 当用户点击扩展图标时，打开选项页面
chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});

// 监听存储中的配置变化，如果发生变化，则重新加载并重新连接
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
        console.log('检测到配置已更改。正在重新加载并使用新配置重新连接...');
        loadConfig().then(() => {
            if (ws) {
                // 如果当前有连接，优雅地关闭它，并阻止其自动重连
                ws.onclose = null; // 移除 onclose 的重连逻辑
                ws.close(1000, '配置已更改，需要重新连接');
                ws = null;
            }
            connect(); // 使用新配置建立连接
        });
    }
});

// 初始化扩展
(async () => {
    await loadConfig();
    connect();
})();

// MODIFIED: 客户端主动发送应用层心跳消息
// 这有助于保持 Service Worker 活跃，并向服务器发送应用层信号
setInterval(() => {
    if (ws && ws.readyState === ws.OPEN) {
        // 发送一个应用层心跳消息。服务器的on('message')会接收到。
        // 这与浏览器自动响应的WebSocket原生pong帧不同，
        // 但可以作为额外的活跃信号，并帮助保持Service Worker活跃。
        ws.send(JSON.stringify({ type: 'heartbeat', fromAgentId: config.agentId }));
    }
}, 30000); // 每30秒发送一次应用层心跳