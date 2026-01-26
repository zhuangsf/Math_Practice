// Application entry point
// modify by jx: implement main entry file for Vue application

import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import './assets/styles/main.css';

// Create Vue app
const app = createApp(App);

// Use Element Plus
app.use(ElementPlus);

// Mount app
app.mount('#app');
