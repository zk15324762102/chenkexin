//第一个函数:createRouter用于创建路由器的方法,一个路由器可以管理多个路由对象
//第二个函数:createWebHistory用于创建Histor模式
//createWebHashHistory用于创建hash模式
import { createRouter, createWebHistory} from 'vue-router';
//引入的是项目的路由对象
import { staticRoutes } from '@/router/routes';

//路由:login(一级)
//创建路由器
const router = createRouter({
  //设置路由的模式:history
	history: createWebHistory(),
  //路由
	routes: staticRoutes,
  //滚动行为
  scrollBehavior() {
    return { top: 0, left: 0}
  },
})
// 导出路由
export default router;