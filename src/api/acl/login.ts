import request from '@/utils/request';
//引入登录请求请求携带参数类型
import type { loginData, loginResponseData,userInfoResponseData } from './model/login';
//枚举定义接口地址
enum API {
    LOGOURL = '/admin/acl/index/login',//登录
    INFO = "/admin/acl/index/info",//获取用户信息
    LOGOUT="/admin/acl/index/logout"
}
//登录接口
export const reqLogin = (data: loginData) => request.post<any, loginResponseData>(API.LOGOURL, data);
//获取用户信息---请求头携带token
export const reqUserInfo = () => request.get<any,userInfoResponseData>(API.INFO);
//退出登录
export const reqLogOut = ()=>request.post<any,any>(API.LOGOUT);