// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    // --- 配置 ---
    const SERVER_URL = `ws://${window.location.host}?type=controller&token=your-super-secret-token-123`;
    const PAGE_LOAD_TIMEOUT = 10000;
    const AI_RESPONSE_TIMEOUT = 300000;

    // --- DOM 元素 ---
    const serverStatusEl = document.getElementById('serverStatus');
    const agentSelectorEl = document.getElementById('agentSelector');
    const logAreaEl = document.getElementById('logArea');
    const allButtons = document.querySelectorAll('button');

    // 区域1: 标签页 & 页面
    const urlInputEl = document.getElementById('urlInput');
    const createTabBtn = document.getElementById('createTabBtn');
    const searchInputEl = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const getTitleBtn = document.getElementById('getTitleBtn');
    const capturePageBtn = document.getElementById('capturePageBtn');

    // 区域2: AI 助手
    const aiPromptEl = document.getElementById('aiPrompt');
    const askAiBtn = document.getElementById('askAiBtn');
    const aiResponsePreviewEl = document.getElementById('aiResponsePreview');

    // 区域3: Cookie 管理
    const cookieActionSelect = document.getElementById('cookieActionSelect');
    const cookieBtn = document.getElementById('cookieBtn');
    const cookieUrlEl = document.getElementById('cookieUrl');
    const cookieNameGroup = document.getElementById('cookieNameGroup');
    const cookieNameEl = document.getElementById('cookieName');
    const cookieValueGroup = document.getElementById('cookieValueGroup');
    const cookieValueEl = document.getElementById('cookieValue');

    // 区域4: 系统信息
    const getSystemInfoBtn = document.getElementById('getSystemInfoBtn');
    const getProcessesBtn = document.getElementById('getProcessesBtn');

    // 区域5: 实用工具
    const ttsInputEl = document.getElementById('ttsInput');
    const speakBtn = document.getElementById('speakBtn');

    // 区域6: 网络规则
    const netAddRulesInput = document.getElementById('netAddRulesInput');
    const netRemoveRuleIdsInput = document.getElementById('netRemoveRuleIdsInput');
    const updateNetRulesBtn = document.getElementById('updateNetRulesBtn');

    // --- 状态变量 ---
    let ws;
    const pendingRequests = new Map();

    // --- 核心函数 ---

    function logMessage(message, type = 'INFO') {
        const timestamp = new Date().toLocaleTimeString();
        // 如果是对象或数组，格式化为JSON字符串
        if (typeof message === 'object' && message !== null) {
            message = JSON.stringify(message, null, 2);
        }
        const logEntry = `[${timestamp}] [${type}] ${message}\n`;
        logAreaEl.textContent += logEntry;
        logAreaEl.scrollTop = logAreaEl.scrollHeight;
    }

    function updateUIState() {
        const isConnected = ws && ws.readyState === WebSocket.OPEN;
        const isAgentSelected = agentSelectorEl.value && !agentSelectorEl.disabled;
        const enabled = isConnected && isAgentSelected;

        allButtons.forEach(btn => btn.disabled = !enabled);

        // 特殊处理，即使未连接代理，也应该能看到下拉框
        agentSelectorEl.disabled = !isConnected || agentSelectorEl.options.length === 0 || agentSelectorEl.options[0].textContent.includes('没有');
    }

    function updateAgentList(agents) {
        const currentSelection = agentSelectorEl.value;
        agentSelectorEl.innerHTML = '';

        if (agents.length === 0) {
            const option = document.createElement('option');
            option.textContent = '没有代理连接';
            agentSelectorEl.appendChild(option);
        } else {
            agents.forEach(agent => {
                const option = document.createElement('option');
                option.value = agent.id;
                option.textContent = `代理 ID: ${agent.id}`;
                agentSelectorEl.appendChild(option);
            });
        }

        if (agents.some(agent => agent.id === currentSelection)) {
            agentSelectorEl.value = currentSelection;
        }
        updateUIState();
    }

    function connect() {
        logMessage('正在尝试连接到服务器...');
        ws = new WebSocket(SERVER_URL);

        ws.onopen = () => {
            serverStatusEl.classList.remove('disconnected');
            serverStatusEl.classList.add('connected');
            logMessage('已成功连接到服务器。');
            updateUIState();
        };

        ws.onclose = () => {
            serverStatusEl.classList.remove('connected');
            serverStatusEl.classList.add('disconnected');
            logMessage('已从服务器断开。5秒后重试...', 'WARN');
            updateAgentList([]);
            setTimeout(connect, 5000);
        };

        ws.onerror = (error) => {
            logMessage(`WebSocket 错误`, 'ERROR');
            console.error(error);
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            logMessage(message, 'RECV');

            if (message.event === 'agent_list_update') {
                updateAgentList(message.payload);
            } else if (message.event === 'agent_status') {
                logMessage(`代理 '${message.payload.id}' 当前状态: ${message.payload.status}。`, 'STATUS');
            } else if (message.event === 'ai_response_preview') {
                aiResponsePreviewEl.textContent = message.payload.body || '收到的响应内容为空。';
            } else if (message.response_to) {
                const request = pendingRequests.get(message.response_to);
                if (request) {
                    if (message.status === 'success') {
                        request.resolve(message.data);
                    } else {
                        request.reject(new Error(message.error_message));
                    }
                    pendingRequests.delete(message.response_to);
                }
            }
        };
    }

    function sendCommand(action, payload, timeout = 15000) {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            const err = '无法发送命令。未连接到服务器。';
            logMessage(err, 'ERROR');
            return Promise.reject(new Error(err));
        }
        const targetAgentId = agentSelectorEl.value;
        if (!targetAgentId || agentSelectorEl.disabled) {
            const err = '无法发送命令。未选择代理。';
            logMessage(err, 'ERROR');
            return Promise.reject(new Error(err));
        }

        const command = {
            id: `req-${Date.now()}-${Math.random()}`,
            targetAgentId,
            action,
            payload
        };

        logMessage(command, 'SEND');
        ws.send(JSON.stringify(command));

        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                pendingRequests.delete(command.id);
                reject(new Error(`请求超时 (${timeout / 1000}秒)。`));
            }, timeout);
            pendingRequests.set(command.id, {
                resolve: (data) => { clearTimeout(timeoutId); resolve(data); },
                reject: (error) => { clearTimeout(timeoutId); reject(error); }
            });
        });
    }

    async function handleCommand(action, payload, timeout, successMessage) {
        try {
            const response = await sendCommand(action, payload, timeout);
            logMessage(`${successMessage || `命令 '${action}' 成功`}:`, 'SUCCESS');
            logMessage(response);
        } catch (error) {
            logMessage(`命令 '${action}' 失败: ${error.message}`, 'ERROR');
        }
    }

    // --- 事件监听器 ---

    // 区域1: 标签页 & 页面
    createTabBtn.addEventListener('click', () => {
        const url = urlInputEl.value.trim();
        if (!url) return logMessage('URL 不能为空。', 'ERROR');
        handleCommand('create_tab', { url }, PAGE_LOAD_TIMEOUT, '创建标签页成功');
    });

    searchBtn.addEventListener('click', () => {
        const text = searchInputEl.value.trim();
        if (!text) return logMessage('搜索内容不能为空。', 'ERROR');
        handleCommand('search_query', { text }, PAGE_LOAD_TIMEOUT, '执行搜索成功');
    });

    getTitleBtn.addEventListener('click', () => handleCommand('get_title', {}, 10000, '获取页面信息成功'));
    capturePageBtn.addEventListener('click', () => handleCommand('capture_page', {}, 20000, '捕获页面成功'));

    // 区域2: AI 助手
    askAiBtn.addEventListener('click', () => {
        const prompt = aiPromptEl.value.trim();
        if (!prompt) return logMessage('AI Prompt 不能为空。', 'ERROR');
        aiResponsePreviewEl.textContent = '正在发送请求并等待响应...';
        handleCommand('ask_ai', { prompt }, AI_RESPONSE_TIMEOUT + PAGE_LOAD_TIMEOUT, 'AI 回答');
    });

    // 区域3: Cookie 管理 (动态UI)
    cookieActionSelect.addEventListener('change', () => {
        const action = cookieActionSelect.value;
        cookieNameGroup.classList.toggle('hidden', action === 'getAll');
        cookieValueGroup.classList.toggle('hidden', action !== 'set');
    });

    cookieBtn.addEventListener('click', () => {
        const sub_action = cookieActionSelect.value;
        const url = cookieUrlEl.value.trim();
        const name = cookieNameEl.value.trim();
        const value = cookieValueEl.value.trim();

        if (!url) return logMessage('Cookie 操作需要 URL。', 'ERROR');

        const params = { url };
        if (sub_action !== 'getAll') {
            if (!name) return logMessage('此操作需要 Cookie 名称。', 'ERROR');
            params.name = name;
        }
        if (sub_action === 'set') {
            params.value = value;
        }

        handleCommand('manage_cookies', { sub_action, params }, 10000, 'Cookie 操作成功');
    });

    // 区域4: 系统信息
    getSystemInfoBtn.addEventListener('click', () => handleCommand('get_system_info', {}, 10000, '系统信息'));
    getProcessesBtn.addEventListener('click', () => handleCommand('get_browser_processes', {}, 10000, '浏览器进程信息'));

    // 区域5: 实用工具
    speakBtn.addEventListener('click', () => {
        const text = ttsInputEl.value.trim();
        if (!text) return logMessage('朗读内容不能为空。', 'ERROR');
        handleCommand('speak_text', { text }, 10000, '语音朗读指令已发送');
    });

    // 区域6: 网络规则
    updateNetRulesBtn.addEventListener('click', () => {
        const addRulesStr = netAddRulesInput.value.trim();
        const removeRuleIdsStr = netRemoveRuleIdsInput.value.trim();
        const payload = {};

        if (addRulesStr) {
            try {
                payload.addRules = JSON.parse(addRulesStr);
            } catch (e) {
                return logMessage('添加规则的JSON格式无效: ' + e.message, 'ERROR');
            }
        }
        if (removeRuleIdsStr) {
            payload.removeRuleIds = removeRuleIdsStr.split(',').map(id => parseInt(id.trim(), 10)).filter(Number.isInteger);
        }

        if (!payload.addRules && !payload.removeRuleIds) {
            return logMessage('请提供要添加或移除的网络规则。', 'ERROR');
        }

        handleCommand('update_net_rules', payload, 10000, '网络规则更新成功');
    });

    // --- 初始化 ---
    agentSelectorEl.addEventListener('change', updateUIState);
    connect();
    updateUIState();
});