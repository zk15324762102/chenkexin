//登录接口携带参数的ts类型
export interface LoginParams {
    password: string,
    username: string
}

//登录接口返回的数据的ts类型
export interface LoginResponseData{
    token:string
}

//获取用户信息接口返回的数据的ts类型
export interface UserInfoResponseData{
    name:string,
    avatar:string,
    roles:string[],
    buttons:string[],
    routes:string[]
}