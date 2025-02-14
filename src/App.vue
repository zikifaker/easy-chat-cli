<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
:root {
  --primary-color: #1a73e8;
  --background-color: #ffffff;
  --text-color: #202124;
  --border-color: #dadce0;
  --hover-color: #f8f9fa;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
}

body {
  font-family: 'Google Sans', Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

button {
  font-family: 'Google Sans', Arial, sans-serif;
  cursor: pointer;
  transition: background-color 0.2s;
}

input {
  font-family: 'Google Sans', Arial, sans-serif;
}
</style>
