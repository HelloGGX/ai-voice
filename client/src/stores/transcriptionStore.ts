import { defineStore } from 'pinia'

interface TranscriptionState {
  transcription: string
  error: string | null
  isConnected: boolean
  worker: Worker | null
  sentChunksCount: number
  receivedChunksCount: number
  allTranscriptionsReceived: boolean
  waitForAllResolve: (() => void) | null
}

export const useTranscriptionStore = defineStore('transcription', {
  state: (): TranscriptionState => ({
    transcription: '',
    error: null,
    isConnected: false,
    worker: null,
    sentChunksCount: 0,
    receivedChunksCount: 0,
    allTranscriptionsReceived: false,
    waitForAllResolve: null,
  }),
  actions: {
    initializeWorker() {
     
    },
    setupWorkerHandlers() {
      if (!this.worker) return
      console.log('Setting up worker message handlers.')

      this.worker.onmessage = (event) => {
        const { type, payload } = event.data
        if (type === 'MESSAGE') {
          this.handleWorkerMessage(payload)
        }
      }
    },
    handleWorkerMessage(message: any) {},
    async sendAudioChunk(wsEndpoint: string, audioChunk: ArrayBuffer) {},
  },
})
