import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog, Loading } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading
  },
  config: {
    notify: {
      position: 'top-right',
      timeout: 2500,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }]
    },
    brand: {
      primary: '#6A1B9A',    // Фиолетовый как у Wildberries
      secondary: '#E91E63',  // Розовый акцент
      accent: '#FF5722',     // Оранжевый для выделения
      dark: '#1A1A1A',       // Темный
      positive: '#4CAF50',   // Зеленый
      negative: '#F44336',   // Красный
      info: '#2196F3',       // Синий
      warning: '#FF9800'     // Желтый
    }
  }
})

app.mount('#app')
