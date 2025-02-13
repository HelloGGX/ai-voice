// 与后端服务器建立WebSocket连接。
// 将处理后的音频数据发送到后端进行转录。
// 从后端接收转录的文本并将其转发到transcriptionStore。

import type { WebSocketMessage } from '@/types/transcription';

interface WorkerMessage {
  type: string; // 消息类型
  payload?: any; // 消息负载
}

let websocket: WebSocket | null = null; // WebSocket连接对象

// 监听来自主线程的消息
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data; // 解构消息类型和负载
  console.log('TranscriptionWorker 收到消息:', type); // 输出收到的消息类型

  switch (type) {
    case 'CONNECT':
      // 检查是否提供了WebSocket端点
      if (!payload.transcriptionWsEndpoint) {
        console.error('缺少transcriptionWsEndpoint配置。'); // 输出错误信息
        postMessage({ 
          type: 'ERROR', 
          payload: '缺少transcriptionWsEndpoint配置' 
        });
        return; // 结束函数
      }
      connect(payload.transcriptionWsEndpoint); // 连接WebSocket
      break;
    case 'DISCONNECT':
      console.log('收到 DISCONNECT 消息。'); // 输出收到的断开连接消息
      disconnect(); // 断开WebSocket连接
      break;
    case 'SEND_AUDIO':
      console.log('收到 SEND_AUDIO 消息。'); // 输出收到的发送音频消息
      // 现在期望直接作为ArrayBuffer的WAV数据
      sendAudioData(payload.wavData); // 发送音频数据
      break;
    default:
      console.warn('来自主线程的未知消息类型:', type); // 输出未知消息类型的警告
  }
};

// 连接到WebSocket
const connect = (wsEndpoint: string) => {
  console.log('连接到WebSocket端点:', wsEndpoint); // 输出连接的WebSocket端点
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    console.log('WebSocket已经连接。'); // 输出WebSocket已连接的信息
    postMessage({ type: 'CONNECTED' }); // 通知主线程已连接
    return; // 结束函数
  }

  try {
    websocket = new WebSocket(wsEndpoint); // 创建WebSocket连接
    websocket.binaryType = 'arraybuffer'; // 设置二进制类型为ArrayBuffer

    // WebSocket连接成功时的回调
    websocket.onopen = () => {
      console.log('WebSocket连接在worker中建立。'); // 输出连接成功的信息
      postMessage({ type: 'CONNECTED' }); // 通知主线程已连接
    };

    // 接收到WebSocket消息时的回调
    websocket.onmessage = (event) => {
      try {
        if (typeof event.data === 'string') {
          const message: WebSocketMessage = JSON.parse(event.data); // 解析消息
          console.log('在worker中收到WebSocket消息:', message); // 输出收到的消息
          postMessage({ type: 'MESSAGE', payload: message }); // 转发消息到主线程
        }
      } catch (err) {
        console.error('Worker解析WebSocket消息时出错:', err); // 输出解析错误
        postMessage({ 
          type: 'ERROR', 
          payload: '解析WebSocket消息时出错' 
        });
      }
    };

    // WebSocket连接关闭时的回调
    websocket.onclose = (event) => {
      console.log('WebSocket连接在worker中关闭:', event.code, event.reason); // 输出关闭信息
      postMessage({ 
        type: 'DISCONNECTED', 
        payload: { code: event.code, reason: event.reason } 
      });
    };

    // WebSocket发生错误时的回调
    websocket.onerror = (event) => {
      console.error('Worker中的WebSocket错误:', event); // 输出WebSocket错误
      postMessage({ 
        type: 'ERROR', 
        payload: 'WebSocket连接错误' 
      });
    };
  } catch (error) {
    console.error('建立WebSocket连接时出错:', error); // 输出连接错误
    postMessage({ 
      type: 'ERROR', 
      payload: '无法建立WebSocket连接' 
    });
  }
};

// 断开WebSocket连接
const disconnect = () => {
  console.log('正在断开WebSocket连接。'); // 输出断开连接的信息
  if (websocket) {
    websocket.close(); // 关闭WebSocket连接
    websocket = null; // 清空WebSocket对象
    postMessage({ type: 'DISCONNECTED' }); // 通知主线程已断开连接
    console.log('WebSocket已断开连接。'); // 输出已断开连接的信息
  } else {
    console.warn('WebSocket已经为null。'); // 输出警告信息
  }
};

// 发送音频数据到WebSocket
const sendAudioData = (data: ArrayBuffer) => {
  console.log('正在向WebSocket发送音频数据。'); // 输出发送音频数据的信息
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket未连接。无法发送音频数据。'); // 输出未连接的错误
    postMessage({ 
      type: 'ERROR', 
      payload: 'WebSocket未连接。无法发送音频数据。' 
    });
    return; // 结束函数
  }

  try {
    websocket.send(data); // 发送音频数据
    console.log('音频数据已发送到WebSocket。'); // 输出发送成功的信息
  } catch (error) {
    console.error('发送音频数据时出错:', error); // 输出发送错误
    postMessage({ 
      type: 'ERROR', 
      payload: '发送音频数据失败' 
    });
  }
};