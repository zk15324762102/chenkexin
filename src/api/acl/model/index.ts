//定义请求参数类型|服务器接口返回数据类型
//登录接口请求体携带的参数类型
export interface loginParams {
   username:string,
   password:string
}

//登录接口返回值的数据类型
export interface loginResponseData {
     token:string
}

//获取用户信息数据类型
export interface userResponseData{
     name:string,
     avatar:string,
     roles:string[],
     buttons:string[],
     routes:string[]
}