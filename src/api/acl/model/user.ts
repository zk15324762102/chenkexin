//登录接口需要携带请求体参数-对象
export interface loginData {
    username: string,
    password: string
}
//登录接口返回值的类型
export interface loginResponseData {
    token: string
}

//用户信息接口返回数据类型
export interface userInfoResponseData {
    name:string,
    avatar:string,
    roles:string[],
    buttons:string[],
    routes:string[]
}