import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import HighchartsVue from 'highcharts-vue'

// Import SAP CRM Design System CSS
import './assets/css/sap-crm-colors.css'
import './assets/css/sap-crm-global.css'
import './assets/css/sap-crm-components.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(HighchartsVue)
app.mount('#app')
