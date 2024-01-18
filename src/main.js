// FILE: main.js

import { createApp } from "vue";
import { Quasar } from "quasar";
import { createRouter, createWebHistory } from "vue-router";
import VueSmoothScroll from "vue3-smooth-scroll";
import homepage from "./views/homepage.vue";
import Schedule from "./components/Schedule.vue";
import RecommenedFood from "./components/RecommenedFood.vue";
// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "./App.vue";

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: homepage },
    { path: "/schedule", component: Schedule },
    { path: "/recommened-food", component: RecommenedFood },
  ],
});

myApp.use(router);
myApp.use(VueSmoothScroll);

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount("#app");
