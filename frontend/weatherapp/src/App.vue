<template>
  <div>
    <select data-choose-theme>
      <option disabled value="">
        Pick a theme
      </option>
      <option v-for="theme in themes" :value="theme">{{theme}}</option>
    </select>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue'
import { themeChange } from 'theme-change'

const themes = [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
    ]

onMounted(() => {
  themeChange('false')
})
</script>