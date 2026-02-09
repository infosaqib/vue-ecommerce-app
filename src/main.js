import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
const pinia = createPinia()

import "./assets/main.css";
import "primeicons/primeicons.css";

import Toast from 'vue-toastification'; // Add this line
import 'vue-toastification/dist/index.css'; // Add this line

const app = createApp(App);

app.use(router);
app.use(Toast);
app.use(pinia)

app.mount("#app");