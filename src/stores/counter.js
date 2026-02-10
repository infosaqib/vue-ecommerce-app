// stores/counter.js
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(Number(localStorage.getItem("count") || []));

  watch(count, (val) => {
    localStorage.setItem("count", val);
  });

  function increment() {
    count.value++;
  }
  function decrement() {
    count.value--;
  }

  return { count, increment, decrement };
});
