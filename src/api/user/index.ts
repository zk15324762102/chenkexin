//书写用户登录相关的接口地方
import request from '@/utils/request';
import type { LoginParams,LoginResponseData,UserInfoResponseData} from './type';
//枚举enum:相关模块地址
enum API {
    //登录接口:post,请求体需要携带参数{username:'',password:''}
    LOGIN_URL = "/admin/acl/index/login",
    //获取用户信息:GET,请求头携带公共参数token
    USERINFO_URL='/admin/acl/index/info',
    //退出登录接口:请求头携带token
    USERLOGOUT_URL='/admin/acl/index/logout'
}

//登录接口
export const reqUserLogin = (data:LoginParams)=>request.post<any,LoginResponseData>(API.LOGIN_URL,data);
//获取用户信息
export const reqUserInfo = ()=>request.get<any,UserInfoResponseData>(API.USERINFO_URL);
//退出登录
export const reqUserLogOut = ()=>request.post<any,any>(API.USERLOGOUT_URL);


