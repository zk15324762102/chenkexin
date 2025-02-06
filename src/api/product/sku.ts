import request from '@/utils/request';

//枚举SKU模块相关的地址
enum API {
    //获取SKU分页接口
    SKULIST_URL = "/admin/product/list/",
    //对应商品上架的请求
    SALE_URL = "/admin/product/onSale/",
    //对应商品下架的请求
    CANCELSALE_URL = "/admin/product/cancelSale/",
    //获取商品详情
    SKUINFO_URL="/admin/product/getSkuById/",
    //删除商品的接口
    DELETESKU_URL="/admin/product/deleteSku/"
}
//获取商品分页的数据
export const reqSkuList = (page: number, limit: number) => request.get<any, any>(API.SKULIST_URL + `${page}/${limit}`);
//对应商品上架接口
export const reqSkuSale = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId);
//对应商品下架的接口
export const reqCancelSale = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId);
//获取商品详情数据
export const reqSkuInfo = (skuId:number)=>request.get<any,any>(API.SKUINFO_URL+skuId);
//删除商品的接口
export const reqDeleteSku = (skuId:number)=>request.delete<any,any>(API.DELETESKU_URL+skuId);