import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'customer-id-form',
      component: require('@/components/CustomerIdForm').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
