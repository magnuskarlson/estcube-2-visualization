import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.config.ignoredElements = [
  'a-scene',
  'a-entity',
  'a-camera',
  'a-box',
  'a-sky',
  'a-sphere',
  'a-cylinder',
  'a-plane',
  'a-marker-camera',
  'a-marker',
  'a-text',
];

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
