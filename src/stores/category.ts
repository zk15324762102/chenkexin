//分类全局组件小仓库
import { defineStore } from "pinia";
//引入请求分类的API
import { reqC1, reqC2, reqC3 } from '@/api/product/category';
import type { CategoryResponseData } from '@/api/product/type/category';
//引入vue3组合式API函数
import { ref } from 'vue';
//获取创建小仓库方法:对外暴露
const useCategoryStore = defineStore('category', () => {
    //存储一级分类的数据
    const c1Arr = ref<CategoryResponseData>([]);
    //存储二级分类的数据
    const c2Arr = ref<CategoryResponseData>([]);
    //存储三级分类的数据
    const c3Arr = ref<CategoryResponseData>([]);
    //存储一级分类ID的字段
    const c1Id = ref<string | number>('');
    //存储二级分类的ID字段
    const c2Id = ref<string | number>('');
    //存储三级分类的ID字段
    const c3Id = ref<string | number>('');
    //组合式API仓库写法:返回对象的属性|方法提供给组件实例
    const getC1 = async () => {
        const result: CategoryResponseData = await reqC1();
        //存储数据
        c1Arr.value = result;
    }
    //获取二级分类的数据
    const getC2 = async () => {
        const result = await reqC2(c1Id.value as number);
        c2Arr.value = result;
    }
    //获取三级分类的数据
    const getC3 = async () => {
        const result = await reqC3(c2Id.value as number);
        c3Arr.value = result;
    }
    return {
        getC1,
        c1Arr,
        c1Id,
        getC2,
        c2Arr,
        c2Id,
        getC3,
        c3Arr,
        c3Id
    }
});
//对外暴露方法[默认暴露:引入的时候不需要花括号]
export default useCategoryStore;


