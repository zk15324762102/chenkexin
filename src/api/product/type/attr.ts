//属性值的ts类型
export interface AttrValue {
    id?: number,
    valueName: string,
    attrId?: number,
    showInput?:boolean
}
//存储属性值的数据的ts类型
export type AttrValueList = AttrValue[];
//属性对象的ts类型
export interface Attr {
    id?: number,
    attrName: string,
    categoryId: number|string,
    categoryLevel: number|string,
    attrValueList: AttrValueList
}

//包含属性对象数组类型
export type AttrResponseData = Attr[];