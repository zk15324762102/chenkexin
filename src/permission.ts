//引入路由器对象:需要在这里进行路由鉴权(全局守卫)
import router from '@/router'

//进度条插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//进度条右上角加载小圆圈的设置
NProgress.configure({ showSpinner: false });

//引入pinia仓库
import pinia from '@/stores'
//引入用户相关的小仓库
import { useUserInfoStore } from '@/stores/userInfo'
const userInfoStore = useUserInfoStore(pinia)

//element-plus消息提示组件
import { ElMessage } from 'element-plus'
//引入默认暴露的函数
import getPageTitle from './utils/get-page-title'
// 不用进行token检查的白名单路径数组
const whiteList = ['/login']
//全局守卫之:前置守卫
router.beforeEach(async (to, from, next) => {
  //进度条开始动
  NProgress.start()
  // 设置整个页面的标题
  document.title = getPageTitle(to.meta.title as string)
  //获取pinia小仓库useUserInfoStore的用户信息之token
  //判断当前用户是否登录
  const token = userInfoStore.token
  //用户登录成功判断
  if (token) {
    // 如果请求的是登陆路由
    if (to.path === '/login') {
      // 直接跳转到根路由, 并完成进度条
      next({ path: '/' })
      NProgress.done()
    } else { // 请求的不是登陆路由
      // 是否已经登陆 ！！转布尔值
      const hasLogin = !!userInfoStore.name
      // 如果已经登陆直接放行
      if (hasLogin) {
        next()
      } else {
        try {
          //获取用户信息
          await userInfoStore.getInfo()
          //再次放行
          next(to)
          //进度条消息
          NProgress.done()
        } catch (error: any) {
          //用户退出登录:清空仓库内部用户相关的数据
          await userInfoStore.reset()
          //跳转到登录页面
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    //用户未登录访问login->放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      //用户未登录访问非login->跳转到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})


//全局守卫之后置守卫
router.afterEach(() => {
  //进度条消失
  NProgress.done();
})
