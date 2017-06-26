import Vue from 'vue'
import Router from 'vue-router'
import LiveRoom from '@/components/LiveRoom'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/room/',
  routes: [
    
    {
      path: '/',
      name: 'LiveRoom',
      component: LiveRoom,
    },{
      path: '/mini_room.html',
      name: 'LiveRoom',
      component: LiveRoom,
    }
  ]
})
