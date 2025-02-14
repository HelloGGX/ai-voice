<template>
  <div class="flex flex-col h-screen">
    <header class="bg-gray-800 text-white p-4 flex-shrink-0">
      <h1 class="text-xl font-bold">Live Transcription Demo</h1>
    </header>
    <main class="flex-1 bg-gray-100 p-4 overflow-auto">
      <slot></slot>
    </main>
  </div>
</template>

<style>
html, body, #__nuxt {
  height: 100%;
}
</style>