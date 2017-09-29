// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import VueResource from 'vue-resource'
import Fetch from './fetch'
import {AlertPlugin, LoadingPlugin, ToastPlugin, ConfirmPlugin} from 'vux'
import VueClipboard from 'vue-clipboard2'
import VueChatScroll from './chat-scroll'

Vue.use(VueClipboard)
Vue.use(ToastPlugin)
Vue.use(VueResource)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(Fetch)
Vue.use(VueChatScroll)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App),
  eventhub: new Vue(),
}).$mount('#app-box')
