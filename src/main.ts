import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";

import "./style.css";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia).use(router).use(Toast).mount("#app");
