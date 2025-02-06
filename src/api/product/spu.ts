//SPU管理模块的接口
import request from '@/utils/request';

import type { SpuListResponseData, TradeMarkArr, ImageList, SaleAttrList, AllBaseSale, Spu } from './type/spu';
//枚举SPU模块地址
enum API {
    //获取全部已有SPU列表数据
    GETSPULIST_URL = "/admin/product/",
    //获取全部品牌的接口地址
    GETALLTRADEMARK_URL = "/admin/product/baseTrademark/getTrademarkList",
    //获取某一个SPU的照片墙的数据
    GETIMAGELIST_URL = "/admin/product/spuImageList/",
    //获取某一个已有SPU销售属性与属性值
    GETSALEATTR_URL = "/admin/product/spuSaleAttrList/",
    //获取全部的销售属性:颜色、版本、尺码
    GETBASESALE_URL = "/admin/product/baseSaleAttrList",
    //添加新的SPU接口
    ADDSPU_URL = "/admin/product/saveSpuInfo",
    //更新已有的SPU接口
    UPDATESPU_URL = "/admin/product/updateSpuInfo",
    //添加一个SKU
    ADDSKU_URL="/admin/product/saveSkuInfo",
    // 获取某一个SPU旗下全部SKU商品
    FINDSKU_URL="/admin/product/findBySpuId/",
    //删除已有的SPU
    DELETESPU_URL="/admin/product/deleteSpu/"
}

//获取SPU列表的数据
export const reqSpuList = (page: number, limit: number, category3Id: string | number) => request.get<any, SpuListResponseData>(API.GETSPULIST_URL + `${page}/${limit}?category3Id=${category3Id}`);
//获取全部的品牌接口
export const reqAllTradeMark = () => request.get<any, TradeMarkArr>(API.GETALLTRADEMARK_URL);
//获取某一个SPU的照片墙的数据
export const reqImageList = (spuId: number) => request.get<any, ImageList>(API.GETIMAGELIST_URL + spuId);
//获取已有的SPU拥有的销售属性与属性值
export const reqSpuHasSaleAttr = (spuId: number) => request.get<any, SaleAttrList>(API.GETSALEATTR_URL + spuId);
//获取全部的销售属性
export const reqBaseSale = () => request.get<any, AllBaseSale>(API.GETBASESALE_URL);
//添加与更新已有的SPU接口
export const reqAddOrUpdateSpu = (data: Spu) => {
    if (data.id) {
        //更新
        return request.post(API.UPDATESPU_URL, data);
    } else {
        //添加
        return request.post(API.ADDSPU_URL, data);
    }
}

export const reqAddSku = (data:any)=>request.post<any,any>(API.ADDSKU_URL,data);
//查看SKU列表接口
export const reqSkuList = (spuId:number)=>request.get<any,any>(API.FINDSKU_URL+spuId);
//删除已有的SPU
export const reqDeleteSpu = (spuId:number)=>request.delete(API.DELETESPU_URL+spuId);
