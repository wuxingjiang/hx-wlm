import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/HelloFromVux'
import LiveRoom from '@/components/LiveRoom'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/liveRoom',
      name: 'LiveRoom',
      component: LiveRoom,
    }
  ]
})
