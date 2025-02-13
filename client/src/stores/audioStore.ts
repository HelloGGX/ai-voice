import { defineStore } from 'pinia';

export const useAudioStore = defineStore('audio', {
  state: () => ({
    isStopping: false,
    isRecording: false,
    audioChunks: [],
  }),
  actions: {
    async startRecording(): Promise<void> {
    
    },

    async stopRecording(): Promise<void> {
      
    },
  },
});