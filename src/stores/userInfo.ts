//定义小仓库的写法
import { defineStore } from 'pinia';
//本地存储操作token方法
import { getToken, removeToken, setToken } from '../utils/token-utils';
//当前小仓库state数据类型
import type { UserInfoState } from './interface';
//消息提示框
import { ElMessage } from 'element-plus'
//引入常量路由、异步路由、任意路由
import { staticRoutes, asyncRoute, anyRoute } from '@/router/routes'
//导入用户相关的API
import { reqUserLogin, reqUserInfo, reqUserLogOut } from '@/api/user';
//数据的ts类型
import type { LoginResponseData, UserInfoResponseData } from '@/api/user/type/index';
//引入路由器
import router from '@/router';
//引入lodash深拷贝
import cloneDeep from "lodash/cloneDeep";
//过滤异步路由
function findUserAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((route: any) => {
    if (routes.includes(route.name)) {
      if (route.children && route.children.length > 0) {
        route.children = findUserAsyncRoute(route.children, routes);
      }
      return true;
    }
  })
}


export const useUserInfoStore = defineStore('userInfo', {
  state: (): UserInfoState => {
    return {
      token: getToken() as string,
      name: '',
      avatar: '',
      menuRoutes: [],
      //存储当前用户按钮权限标识
      buttons: []
    }
  },
  actions: {
    //登录方法
    async login(username: string, password: string) {
      //获取登录成功返回的数据:token
      let result: LoginResponseData = await reqUserLogin({ username, password });
      //仓库在存储token
      this.token = result.token;
      //本地存储持久化存储token
      setToken(result.token);
    },

    //获取用户信息方法(路由鉴权哪里进行调用)
    async getInfo() {
      // 获取用户信息
      let result: UserInfoResponseData = await reqUserInfo();
      //用户信息包含:用户名字、用户头像、用户的职位(数组)、用户按钮权限(数组)、用户的路由权限标识[路由组件的名字]
      //存储用户的名字
      this.name = result.name;
      //存储用户头像
      this.avatar = result.avatar;
      //pinia仓库:menuRoute属性能决定左侧菜单展示哪有路由！！！
      //存储当前用户拥有哪些按钮权限标识 ['btn.模块的名字.xxxx']
      this.buttons = result.buttons;
      //过滤出这个用户需要展示异步路由
      const userAsyncRoute = findUserAsyncRoute(cloneDeep(asyncRoute), result.routes);
      //左侧菜单展示:决定左侧菜单(导航)显示与否
      //router注册路由只有静态路由 
      this.menuRoutes = [...staticRoutes,...userAsyncRoute,anyRoute];
      //动态追加路由:异步路由、任意路由即可！！！ router.getRoutes获取路由器全部的路由！！！
      [...userAsyncRoute,anyRoute].forEach((route:any)=>{
          router.addRoute(route);
      })


    },
    //退出登录
    async reset() {
      //退出登录通知服务器端:token不需要了！！！！
      await reqUserLogOut();
      // 删除local中保存的token
      removeToken()
      // 提交重置用户信息的mutation
      this.token = ''
      this.name = ''
      this.avatar = '';

      //清空当前用户全部的路由
      router.getRoutes().forEach((route:any)=>{
           //退出登录清空全部路由
           router.removeRoute(route.name);
      });
      //退出登录保留全部的常量路由
      staticRoutes.forEach((route:any)=>{
          router.addRoute(route);
      })

    },
  },
});

