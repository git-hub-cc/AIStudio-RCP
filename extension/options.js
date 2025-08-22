// options.js

const serverUrlInput = document.getElementById('serverUrl');
const agentIdInput = document.getElementById('agentId');
const tokenInput = document.getElementById('token');
const saveButton = document.getElementById('save');
const statusDiv = document.getElementById('status');

const DEFAULTS = {
    serverUrl: 'ws://localhost:8080',
    agentId: `agent-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    token: 'your-super-secret-token-123'
};

function saveOptions() {
    const serverUrl = serverUrlInput.value.trim();
    const agentId = agentIdInput.value.trim();
    const token = tokenInput.value.trim();

    // NEW: 输入验证
    if (!serverUrl) {
        statusDiv.textContent = '错误：服务器 URL 不能为空。';
        statusDiv.style.color = 'red';
        return;
    }
    if (!serverUrl.startsWith('ws://') && !serverUrl.startsWith('wss://')) {
        statusDiv.textContent = '错误：URL 必须以 ws:// 或 wss:// 开头。';
        statusDiv.style.color = 'red';
        return;
    }
    if (!agentId) {
        statusDiv.textContent = '错误：代理 ID 不能为空。';
        statusDiv.style.color = 'red';
        return;
    }

    chrome.storage.local.set({
        serverUrl,
        agentId,
        token
    }, () => {
        statusDiv.textContent = '设置已保存。代理将使用新设置重新连接。';
        statusDiv.style.color = 'green';
        setTimeout(() => {
            statusDiv.textContent = '';
        }, 3000);
    });
}

function restoreOptions() {
    chrome.storage.local.get(Object.keys(DEFAULTS), (items) => {
        serverUrlInput.value = items.serverUrl || DEFAULTS.serverUrl;
        agentIdInput.value = items.agentId || DEFAULTS.agentId;
        tokenInput.value = items.token || DEFAULTS.token;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);