import request from '@/utils/request';
import type { CategoryResponseData } from './type/category';
//枚举地址
enum API {
    //获取一级分类的GET请求:不需要携带任何参数
    GETC1_URL="/admin/product/getCategory1",
    //获取二级分类的数据GET请求:需要携带一级分类的ID
    GETC2_URL="/admin/product/getCategory2/",
    //获取三级分类的数据GET请求:需要携带二级分类的ID
    GETC3_URL="/admin/product/getCategory3/"
}

//获取一级分类
export const reqC1 = ()=>request.get<any,CategoryResponseData>(API.GETC1_URL);
//获取二级分类
export const reqC2 = (category1Id:number)=>request.get<any,CategoryResponseData>(API.GETC2_URL+category1Id);
//获取三级分类
export const reqC3 = (category2Id:number)=>request.get<any,CategoryResponseData>(API.GETC3_URL+category2Id);