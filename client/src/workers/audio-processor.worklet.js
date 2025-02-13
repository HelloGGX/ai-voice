// 处理捕获的原始音频数据audioStore。
// 将原始音频流转换为与 Whisper 模型兼容的 WAV 格式。
// 作为 运行AudioWorklet，它是在音频渲染线程上运行的高性能音频处理脚本。
class AudioChunkProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();
      // 从选项中获取目标采样率和块持续时间
      const { targetSampleRate, chunkDuration } = options.processorOptions;
      // 如果没有提供目标采样率，则默认为 16000
      this.targetSampleRate = targetSampleRate || 16000;
      // 如果没有提供块持续时间，则默认为 5 秒
      this.chunkDuration = chunkDuration || 5;
      // 计算块大小
      this.chunkSize = this.targetSampleRate * this.chunkDuration;
      // 初始化缓冲区
      this.buffer = new Float32Array(this.chunkSize);
      // 初始化样本计数
      this.sampleCount = 0;
      // 输入是否停止的标志
      this.isInputStopped = false;
  
      // 监听来自主线程的消息
      this.port.onmessage = (event) => {
        const { type } = event.data;
        // 如果接收到 FLUSH 消息，停止输入并尝试刷新和完成处理
        if (type === 'FLUSH') {
          this.isInputStopped = true;
          this.tryFlushAndFinalize();
        }
      };
    }
  
    // 创建 WAV 文件头
    createWavHeader(pcmLength) {
      const header = new ArrayBuffer(44); // WAV 文件头长度为 44 字节
      const view = new DataView(header);
      
      // RIFF 标识符
      view.setUint8(0, 'R'.charCodeAt(0));
      view.setUint8(1, 'I'.charCodeAt(0));
      view.setUint8(2, 'F'.charCodeAt(0));
      view.setUint8(3, 'F'.charCodeAt(0));
      
      // 文件长度
      view.setUint32(4, pcmLength * 2 + 36, true);
      
      // WAVE 标识符
      view.setUint8(8, 'W'.charCodeAt(0));
      view.setUint8(9, 'A'.charCodeAt(0));
      view.setUint8(10, 'V'.charCodeAt(0));
      view.setUint8(11, 'E'.charCodeAt(0));
      
      // 格式块标识符
      view.setUint8(12, 'f'.charCodeAt(0));
      view.setUint8(13, 'm'.charCodeAt(0));
      view.setUint8(14, 't'.charCodeAt(0));
      view.setUint8(15, ' '.charCodeAt(0));
      
      // 格式块长度
      view.setUint32(16, 16, true);
      
      // 样本格式（原始）
      view.setUint16(20, 1, true);
      
      // 通道数
      view.setUint16(22, 1, true);
      
      // 采样率
      view.setUint32(24, this.targetSampleRate, true);
      
      // 字节率
      view.setUint32(28, this.targetSampleRate * 2, true);
      
      // 块对齐
      view.setUint16(32, 2, true);
      
      // 每个样本的位数
      view.setUint16(34, 16, true);
      
      // 数据块标识符
      view.setUint8(36, 'd'.charCodeAt(0));
      view.setUint8(37, 'a'.charCodeAt(0));
      view.setUint8(38, 't'.charCodeAt(0));
      view.setUint8(39, 'a'.charCodeAt(0));
      
      // 数据块长度
      view.setUint32(40, pcmLength * 2, true);
      
      return header; // 返回创建的 WAV 文件头
    }
  
    // 尝试刷新并完成处理
    tryFlushAndFinalize() {
      if (this.sampleCount > 0) {
        // 将 Float32Array 转换为 16 位 PCM
        const pcmBuffer = new Int16Array(this.sampleCount);
        for (let i = 0; i < this.sampleCount; i++) {
          const s = Math.max(-1, Math.min(1, this.buffer[i])); // 限制样本值在 -1 到 1 之间
          pcmBuffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF; // 转换为 16 位 PCM
        }
  
        // 创建 WAV 文件头
        const wavHeader = this.createWavHeader(this.sampleCount);
  
        // 创建 WAV 数据
        const wavData = new Uint8Array(wavHeader.byteLength + pcmBuffer.buffer.byteLength);
        wavData.set(new Uint8Array(wavHeader), 0); // 将 WAV 文件头放入数据中
        wavData.set(new Uint8Array(pcmBuffer.buffer), wavHeader.byteLength); // 将 PCM 数据放入数据中
  
        // 发送最终块
        this.port.postMessage({
          type: 'chunk',
          wavData: wavData,
          targetSampleRate: this.targetSampleRate,
          isFinal: true // 标记为最终块
        }, [wavData.buffer]);
  
        // 重置缓冲区
        this.buffer = new Float32Array(this.chunkSize);
        this.sampleCount = 0;
      }
  
      // 通知完成
      this.port.postMessage({ type: 'flush_done' });
    }
  
    // 处理输入
    process(inputs, outputs, parameters) {
      // 如果输入已停止且样本计数为 0，尝试刷新并完成处理
      if (this.isInputStopped && this.sampleCount === 0) {
        this.tryFlushAndFinalize();
        return false;
      }
  
      const input = inputs[0][0]; // 获取输入
      // 如果没有输入且输入已停止，尝试刷新并完成处理
      if (!input && this.isInputStopped) {
        this.tryFlushAndFinalize();
        return false;
      }
  
      if (!input) return true; // 如果没有输入，返回 true
  
      // 仅在未停止时处理新输入
      if (!this.isInputStopped) {
        for (let i = 0; i < input.length; i++) {
          if (this.sampleCount < this.chunkSize) {
            this.buffer[this.sampleCount++] = input[i]; // 将输入样本存入缓冲区
          }
        }
  
        // 处理完整缓冲区
        if (this.sampleCount >= this.chunkSize) {
          const pcmBuffer = new Int16Array(this.buffer.length);
          for (let i = 0; i < this.buffer.length; i++) {
            const s = Math.max(-1, Math.min(1, this.buffer[i])); // 限制样本值在 -1 到 1 之间
            pcmBuffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF; // 转换为 16 位 PCM
          }
  
          const wavHeader = this.createWavHeader(pcmBuffer.length); // 创建 WAV 文件头
          const wavData = new Uint8Array(wavHeader.byteLength + pcmBuffer.buffer.byteLength);
          wavData.set(new Uint8Array(wavHeader), 0); // 将 WAV 文件头放入数据中
          wavData.set(new Uint8Array(pcmBuffer.buffer), wavHeader.byteLength); // 将 PCM 数据放入数据中
  
          this.port.postMessage({
            type: 'chunk',
            wavData: wavData,
            targetSampleRate: this.targetSampleRate,
            isFinal: false // 标记为非最终块
          }, [wavData.buffer]);
  
          // 重置缓冲区
          this.buffer = new Float32Array(this.chunkSize);
          this.sampleCount = 0;
        }
      }
  
      return true; // 返回 true 以继续处理
    }
  }
  
  // 注册音频块处理器
  registerProcessor('audio-chunk-processor', AudioChunkProcessor);