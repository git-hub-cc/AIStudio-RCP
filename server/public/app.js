// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    const SERVER_URL = `ws://${window.location.host}?type=controller&token=your-super-secret-token-123`;

    const serverStatusEl = document.getElementById('serverStatus');
    const agentSelectorEl = document.getElementById('agentSelector');
    const urlInputEl = document.getElementById('urlInput');
    const createTabBtn = document.getElementById('createTabBtn');
    const getTitleBtn = document.getElementById('getTitleBtn');
    const logAreaEl = document.getElementById('logArea');
    // NEW: AI助手UI元素
    const aiPromptEl = document.getElementById('aiPrompt');
    const askAiBtn = document.getElementById('askAiBtn');
    const aiResponsePreviewEl = document.getElementById('aiResponsePreview'); // NEW
    const PAGE_LOAD_TIMEOUT = 10000; //
    const AI_RESPONSE_TIMEOUT = 300000; // AI响应超时：300秒 (原为60秒)

    let ws;
    const pendingRequests = new Map();

    function updateUIState() {
        const isConnected = ws && ws.readyState === WebSocket.OPEN;
        const isAgentSelected = agentSelectorEl.value && !agentSelectorEl.disabled;

        createTabBtn.disabled = !isConnected || !isAgentSelected;
        getTitleBtn.disabled = !isConnected || !isAgentSelected;
        askAiBtn.disabled = !isConnected || !isAgentSelected; // NEW
    }

    function logMessage(message, type = 'INFO') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] [${type}] ${message}\n`;
        logAreaEl.textContent += logEntry;
        logAreaEl.scrollTop = logAreaEl.scrollHeight;
    }

    function updateAgentList(agents) {
        const currentSelection = agentSelectorEl.value;
        agentSelectorEl.innerHTML = '';

        if (agents.length === 0) {
            const option = document.createElement('option');
            option.textContent = '没有代理连接';
            agentSelectorEl.appendChild(option);
            agentSelectorEl.disabled = true;
        } else {
            agents.forEach(agent => {
                const option = document.createElement('option');
                option.value = agent.id;
                option.textContent = `代理 ID: ${agent.id}`;
                agentSelectorEl.appendChild(option);
            });
            agentSelectorEl.disabled = false;
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
            updateUIState();
            setTimeout(connect, 5000);
        };

        ws.onerror = (error) => {
            logMessage(`WebSocket 错误`, 'ERROR');
            console.error(error);
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleServerMessage(message);
        };
    }

    function handleServerMessage(message) {
        logMessage(`收到消息: ${JSON.stringify(message)}`, 'RECV');

        if (message.event === 'agent_list_update') {
            updateAgentList(message.payload);
        } else if (message.event === 'agent_status') {
            logMessage(`代理 '${message.payload.id}' 当前状态: ${message.payload.status}。`, 'STATUS');
        } else if (message.event === 'ai_response_preview') { // MODIFIED: Handle the response body preview
            const { body } = message.payload;
            aiResponsePreviewEl.textContent = body || '收到的响应内容为空。';
            logMessage('已更新AI响应内容预览。', 'DEBUG');
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
    }

    function sendCommand(command, timeout = 10000) { // MODIFIED: 允许自定义超时
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            logMessage('无法发送命令。未连接到服务器。', 'ERROR');
            return Promise.reject(new Error('未连接'));
        }
        const targetAgentId = agentSelectorEl.value;
        if (!targetAgentId || agentSelectorEl.disabled) {
            logMessage('无法发送命令。未选择代理。', 'ERROR');
            return Promise.reject(new Error('未选择代理'));
        }
        command.id = `req-${Date.now()}-${Math.random()}`;
        command.targetAgentId = targetAgentId;
        logMessage(`正在发送命令: ${JSON.stringify(command)}`, 'SEND');
        ws.send(JSON.stringify(command));
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                if (pendingRequests.has(command.id)) {
                    pendingRequests.delete(command.id);
                    reject(new Error(`请求超时 (${timeout / 1000}秒)。`));
                }
            }, timeout);
            pendingRequests.set(command.id, {
                resolve: (data) => {
                    clearTimeout(timeoutId);
                    resolve(data);
                },
                reject: (error) => {
                    clearTimeout(timeoutId);
                    reject(error);
                }
            });
        });
    }

    createTabBtn.addEventListener('click', async () => {
        const url = urlInputEl.value;
        if (!url) {
            logMessage('URL 不能为空。', 'ERROR');
            return;
        }
        try {
            const response = await sendCommand({
                action: 'create_tab',
                payload: { url }
            });
            logMessage(`'create_tab' 命令已成功执行: ${response.message}`, 'SUCCESS');
        } catch (error) {
            logMessage(`发送 'create_tab' 命令失败: ${error.message}`, 'ERROR');
        }
    });

    getTitleBtn.addEventListener('click', async () => {
        try {
            const response = await sendCommand({
                action: 'get_title',
                payload: {}
            });
            logMessage(`当前活动标签页标题: "${response.title}"`, 'RESULT');
        } catch (error) {
            logMessage(`获取标题失败: ${error.message}`, 'ERROR');
        }
    });

    // NEW: AI助手按钮点击事件
    askAiBtn.addEventListener('click', async () => {
        const prompt = aiPromptEl.value.trim();
        if (!prompt) {
            logMessage('AI Prompt 不能为空。', 'ERROR');
            return;
        }

        // MODIFIED: Reset preview with a more accurate message
        aiResponsePreviewEl.textContent = '正在发送请求并等待响应内容...';

        try {
            logMessage('正在向AI发送问题，请稍候...', 'AI_QUERY');
            const response = await sendCommand({
                action: 'ask_ai',
                payload: { prompt }
            }, AI_RESPONSE_TIMEOUT + PAGE_LOAD_TIMEOUT + 5000); // 超时时间应大于后台脚本的总超时，并增加5秒缓冲以防止竞态条件

            logMessage(`AI 回答:\n--------------------\n${response.answer}\n--------------------`, 'AI_RESULT');
        } catch (error) {
            logMessage(`与AI交互失败: ${error.message}`, 'ERROR');
            aiResponsePreviewEl.textContent = `请求失败: ${error.message}`;
        }
    });

    agentSelectorEl.addEventListener('change', updateUIState);

    connect();
    updateUIState();
});