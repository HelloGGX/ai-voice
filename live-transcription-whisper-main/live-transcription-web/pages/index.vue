<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    <h1 class="text-2xl font-bold mb-4">Live Audio Transcription Demo</h1>
    <AudioRecorder />
    <div class="mt-6 w-full max-w-md">
      <label for="chunkSize" class="block text-sm font-medium text-gray-700">Chunk Size (seconds)</label>
      <input
        type="number"
        id="chunkSize"
        v-model.number="chunkSize"
        min="1"
        max="10"
        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div class="mt-6 w-full max-w-md bg-white p-4 rounded-md shadow">
      <h2 class="text-lg font-medium mb-2">Transcription:</h2>
      <p class="text-gray-800">{{ transcription }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AudioRecorder from '~/components/AudioRecorder.vue'
import { useTranscriptionStore } from '~/stores/transcriptionStore'

const transcriptionStore = useTranscriptionStore()

const transcription = ref('')

watch(
  () => transcriptionStore.transcription,
  (newTranscription) => {
    transcription.value = newTranscription
  }
)

const chunkSize = ref(5) // Default chunk size in seconds

watch(chunkSize, (newSize) => {
  // Implement logic to update chunk size if necessary
  // For simplicity, this demo does not dynamically change backend chunk size
  console.log(`Chunk size set to: ${newSize} seconds`)
})
</script>

<style scoped>
</style>