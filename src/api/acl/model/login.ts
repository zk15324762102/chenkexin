//登录请求:请求体携带的data参数数据类型
//data = {username:'admin',password:'111111'}
export interface loginData {
      username: string,
      password: string
}


//登录请求服务器返回数据类型 {token:'xxxxx'}
export interface loginResponseData {
      token: string
}


//获取用户信息服务器返回数据的类型
export interface userInfoResponseData {
      "routes": string[],
      "buttons": string[],
      "roles": string[],
      "name": string,
      "avatar": string
}