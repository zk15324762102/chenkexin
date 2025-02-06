import request from '@/utils/request';
import type { AttrResponseData,Attr  } from './type/attr';
//枚举地址
enum API {
    //获取平台属性与属性值GET:需要携带三个参数 1|2|3分类的ID
    GETATTR_URL="/admin/product/attrInfoList/",
    //添加新的属性|更新已有属性
    ADDORUPDATEATTR_URL="/admin/product/saveAttrInfo",
    //删除已有的属性接口
    DELETEATTR_URL="/admin/product/deleteAttr/"
}

//获取平台属性与属性值
export const reqAttrList = (category1Id:number|string,category2Id:number|string,category3Id:number|string)=>request.get<any,AttrResponseData>(API.GETATTR_URL+`${category1Id}/${category2Id}/${category3Id}`);
//添加属性与更新属性接口
export const reqAddOrUpdateAttr = (data:Attr)=>request.post<any,any>(API.ADDORUPDATEATTR_URL,data);

//删除已有的属性
export const reqDeleteAttr = (attrId:number)=>request.delete<any,any>(API.DELETEATTR_URL+attrId);