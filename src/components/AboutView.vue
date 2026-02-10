<script setup>

import { useCounterStore } from "@/stores/counter";
const counter = useCounterStore();
</script>

<template>
    <p>A: {{ counter.count }}</p>
  <button @click="counter.increment" class="px-6 py-2 bg-gray-200">Add +</button>
</template>
