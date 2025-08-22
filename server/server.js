// server.js
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
// 重要：这个Token需要与Chrome扩展中设置的Token保持一致
const SECRET_TOKEN = "your-super-secret-token-123";

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const agents = new Map();
const controllers = new Map();

// MODIFIED: 心跳检测设置，增加 HEARTBEAT_INTERVAL 的时长
const HEARTBEAT_INTERVAL = 45000; // 45秒
const HEARTBEAT_TIMEOUT = HEARTBEAT_INTERVAL * 2; // 90秒

function broadcastToControllers(message) {
    const serializedMessage = JSON.stringify(message);
    controllers.forEach((controllerWs) => {
        if (controllerWs.readyState === controllerWs.OPEN) {
            controllerWs.send(serializedMessage);
        }
    });
}

function getAgentList() {
    return Array.from(agents.values()).map(agent => ({ id: agent.id, connectedAt: agent.connectedAt }));
}

wss.on('connection', (ws, req) => {
    const queryParams = url.parse(req.url, true).query;
    const { type, id, token } = queryParams;

    // 1. 认证
    if (token !== SECRET_TOKEN) {
        console.log(`[认证失败] 来自 ${req.socket.remoteAddress} 的连接被拒绝`);
        ws.close(4001, '无效的令牌');
        return;
    }

    // 2. 识别连接类型
    if (type === 'agent' && id) {
        if (agents.has(id)) {
            console.log(`[代理连接] ID为 ${id} 的代理已连接。正在关闭旧连接。`);
            agents.get(id).ws.close(4002, '新的连接已建立');
        }

        console.log(`[代理连接] 代理已连接，ID: ${id}`);
        ws.isAlive = true;
        ws.id = id;
        agents.set(id, { ws, id, connectedAt: new Date().toISOString() });

        ws.on('pong', () => {
            // 当收到原生的 WebSocket pong 帧时，标记为活跃
            ws.isAlive = true;
        });

        broadcastToControllers({
            event: 'agent_status',
            payload: { id, status: 'online', connectedAt: agents.get(id).connectedAt }
        });

        ws.on('message', (message) => {
            console.log(`[来自代理 ${id} 的消息]: ${message}`);
            try {
                const parsedMessage = JSON.parse(message);
                // MODIFIED: 检查是否为客户端发送的应用层心跳消息
                if (parsedMessage.type === 'heartbeat') {
                    console.log(`[心跳] 收到来自代理 ${id} 的应用层心跳。`);
                    ws.isAlive = true; // 收到应用层心跳也重置isAlive状态
                    return; // 应用层心跳通常不需要转发给控制器
                }
                // 将来自代理的消息（通常是响应）转发给所有控制器
                broadcastToControllers(parsedMessage);
            } catch (e) {
                console.error(`[代理 ${id} 消息解析失败]: ${e.message}`, message);
            }
        });

        ws.on('close', () => {
            console.log(`[代理断开] 代理已断开连接: ${id}`);
            agents.delete(id);
            broadcastToControllers({ event: 'agent_status', payload: { id, status: 'offline' } });
        });

    } else if (type === 'controller') {
        const controllerId = `controller-${Date.now()}`;
        console.log(`[控制器连接] 控制器已连接: ${controllerId}`);
        controllers.set(controllerId, ws);

        // 当新控制器连接时，立即发送当前的代理列表
        ws.send(JSON.stringify({
            event: 'agent_list_update',
            payload: getAgentList()
        }));

        ws.on('message', (message) => {
            console.log(`[来自控制器 ${controllerId} 的消息]: ${message}`);
            const command = JSON.parse(message);
            const targetAgent = agents.get(command.targetAgentId);

            if (targetAgent && targetAgent.ws.readyState === targetAgent.ws.OPEN) {
                // 将指令转发给目标代理
                targetAgent.ws.send(JSON.stringify(command));
            } else {
                // 如果目标代理不存在或已离线，则通知控制器
                ws.send(JSON.stringify({
                    response_to: command.id,
                    status: 'error',
                    error_message: `ID为 '${command.targetAgentId}' 的代理未找到或已离线。`
                }));
            }
        });

        ws.on('close', () => {
            console.log(`[控制器断开] 控制器已断开连接: ${controllerId}`);
            controllers.delete(controllerId);
        });

    } else {
        console.log('[连接拒绝] 无效的连接类型或缺少ID。');
        ws.close(4000, '无效的请求');
    }
});

// 3. 心跳检测机制
const interval = setInterval(() => {
    agents.forEach((agent) => {
        if (!agent.ws.isAlive) {
            console.log(`[心跳检测] 代理 ${agent.id} 未通过心跳检测。正在终止连接。`);
            // 如果上一个周期没有收到ping/pong或应用层心跳，则终止
            return agent.ws.terminate();
        }
        agent.ws.isAlive = false; // 为下一次检查做准备，假定已断开
        agent.ws.ping();          // 发送原生ping
    });
}, HEARTBEAT_INTERVAL);

wss.on('close', () => {
    clearInterval(interval);
});

server.listen(PORT, () => {
    console.log(`服务器正在 http://localhost:${PORT} 上监听`);
});