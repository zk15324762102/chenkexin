//品牌接口返回的数据的ts类型
export interface TradeMark {
    id?: number,
    tmName: string,
    logoUrl: string
}
//数组:里面都是已有的品牌（数组里面对象，就这么写）
export type Records = TradeMark[];

//品牌分页器列列表返回的数据ts类型
export interface TradeMarkResponseData {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number
}