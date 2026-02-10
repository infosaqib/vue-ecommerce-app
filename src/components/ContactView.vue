<script setup>

import { useCounterStore } from "@/stores/counter";
const counter = useCounterStore();
</script>

<template>
    <p>B: {{ counter.count }}</p>
  <button @click="counter.decrement" class="px-6 py-2 bg-gray-200">Remove -</button>
</template>
