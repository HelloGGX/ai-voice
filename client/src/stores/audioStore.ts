import { defineStore } from 'pinia';

export const useAudioStore = defineStore('audio', {
  state: () => ({
    isStopping: false,
    isRecording: false,
    audioChunks: [],
  }),
  actions: {
    async startRecording(workspaceId: string, stepId: string) {
     
    },
    async stopRecording(workspaceId: string, stepId: string) {
      
    },
  },
});