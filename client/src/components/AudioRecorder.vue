<template>
  <div class="space-y-4">
    <div class="flex items-center space-x-2">
      <button
        @click="handleListeningToggle"
        :disabled="disabled || audioStore.isStopping"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{{ buttonText }}</span>
      </button>
    </div>
    <div
      v-if="transcriptionStore.transcription"
      class="mt-4 p-4 bg-gray-100 rounded-lg max-h-64 overflow-y-auto text-gray-700 whitespace-pre-wrap"
    >
      <p>{{ transcriptionStore.transcription }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useAudioStore } from '@/stores/audioStore'
import { useTranscriptionStore } from '@/stores/transcriptionStore'

const props = defineProps<{
  disabled?: boolean
}>()

const audioStore = useAudioStore()
const transcriptionStore = useTranscriptionStore()

const buttonText = computed(() => {
  if (audioStore.isStopping) return '停止中...'
  return audioStore.isRecording ? '监听中...' : '开始监听'
})

const handleListeningToggle = async () => {
  try {
    if (!audioStore.isRecording) {
      await audioStore.startRecording()
    } else {
      await audioStore.stopRecording()
    }
  } catch (error: any) {
    console.error('Recording error:', error)
    alert(error.message || 'An unexpected error occurred during recording.')
  }
}
</script>
