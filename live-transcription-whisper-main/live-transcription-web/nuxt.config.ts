import { defineNuxtConfig } from 'nuxt/config'

// Define base configuration
const config = {
  ssr: false,
  
  // Add compatibility date
  compatibilityDate: '2024-11-19',
  
  modules: [
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      // Audio recording configuration
      audio: {
        targetSampleRate: 16000,
        chunkDuration: 3,
        channels: 1,
        transcriptionWsEndpoint: process.env.NUXT_PUBLIC_TRANSCRIPTION_WS_ENDPOINT || 'ws://localhost:8080/ws/transcribe',
        constraints: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      }
    }
  },

  vite: {
    worker: {
      format: 'es',
      rollupOptions: {
        output: {
          format: 'es',
          entryFileNames: 'workers/[name].js'
        }
      }
    }
  },
}

export default defineNuxtConfig(config)