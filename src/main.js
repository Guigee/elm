// eslint-disable-next-line
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'
 
Vue.use(VueRouter)
Vue.use(VueResource)

//定义路由
const routes = [
	{path: '/goods', component: goods},
	{path: '/ratings', component: ratings},
	{path: '/seller', component: seller}
]

//创建router实例，然后传'routes'配置
const router = new VueRouter({
	routes: routes,
	linkActiveClass: 'active'
})

//挂载根实例!!
new Vue({
	el: '#app',
	router,
	components: {App}
})

router.push('/goods')