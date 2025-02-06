//代表已有的SPU数据类型
export interface Spu {
    id?: number,//SPU的ID
    category3Id: string | number,//三级分类的ID
    spuName: string,//SPU的名字
    description: string,//SPU的描述
    tmId: number|string,//品牌的ID
    spuImageList?:ImageList,//已有的SPU照片墙的数据(目前不知道数据类型)
    spuSaleAttrList?:SaleAttrList,//已有的SPU销售属性的数据(目前不知道数据类型)
}
//存储已有的SPU(数组)
export type Records = Spu[];

//SPU列表返回的数据的TS类型
export interface SpuListResponseData {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number
}

/*******************品牌相关的ts类型***************************/ 
export interface TradeMark{
     id:number,
     tmName:string,
     logoUrl:string
}

export type TradeMarkArr = TradeMark[];

/**************************照片墙数据ts类型**********************************/

export interface ImgObj{
    id?:number,
    spuId?:number,
    imgName?:string,
    imgUrl?:string,
    name?:string,
    url?:string,
    isDefault:boolean
}

//数组里面全部图片的数据类型
export type ImageList = ImgObj[];

/****************销售属性与属性值的ts类型***********************/
//属性值类型
export interface SaleAttrValue{
    id?:number,
    spuId?:number,
    baseSaleAttrId:number,
    saleAttrValueName:string,
    saleAttrName?:string,
    isChecked:null
} 
//存储属性值数组的类型
export type spuSaleAttrValueList = SaleAttrValue[];
// 销售属性的ts类型
export interface SaleAttr{
    id?:number,
    spuId?:number,
    baseSaleAttrId?:number,
    saleAttrName?:string,
    spuSaleAttrValueList?:spuSaleAttrValueList ,
    showInput?:boolean,
    saleAttrValueName?:string
}

//存储全部销售属性的ts类型
export type SaleAttrList = SaleAttr[]


/****************全部的sale********************/

export interface BaseSale{
     id:number,
     name:string
}

export type AllBaseSale =BaseSale [];