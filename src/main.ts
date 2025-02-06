//vue3提供的createApp函数:用于创建应用(app)
import { createApp } from 'vue'
const app = createApp(App)
//pinia仓库
import pinia from './stores'
//vue3中PC端的UI组件库:element-plus
//vue3移动端UI组件库:vant
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

//引入根组件
import App from './App.vue'
//vue-router管理项目的路由[登录、首页、404]
import router from './router'
import './styles/index.scss'
//把element-plus全部图标，阿里图标库编程全局组件！！！
import ElSvg from './components/SvgIcon/ElSvg'
ElSvg(app)
//路由鉴权:路由组件(显示的页面访问权限的设置)
import './permission'
//引入分类全局组件
import Category from './components/Category/index.vue';
//第一个参数:全局的名字 第二个参数:组件
app.component('Category', Category);
//引入自定义指令文件函数
import {has} from '@/utils/directive';
has(app);

//引入mock文件
import './mock';


import * as echarts from 'echarts';
//将vue-echarts提供的组件变为全局组件
import VueEcharts from 'vue-echarts';
//全局组件
app.component('v-chart',VueEcharts);


//注册仓库pinia
app.use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')
