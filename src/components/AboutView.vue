<script setup>
import { ref, onMounted, watch } from 'vue'

const count = ref(0)

onMounted(() => {
  count.value = Number(localStorage.getItem('count')) || 0
})

watch(count, (newValue) => {
  localStorage.setItem('count', newValue)
})
</script>

<template>
  <button @click="count++">A: {{ count }}</button>
</template>
