<template>
  <el-form label-width="80px">
    <el-form-item label="SKU名称">
      <el-input placeholder="请你输入SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="SKU价格">
      <el-input
        placeholder="请你输入SKU价格"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU重量">
      <el-input
        placeholder="请你输入SKU重量"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="请你输入SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          :label="attr.attrName"
          v-for="(attr, index) in attrArr"
          :key="attr.id"
        >
          <el-select v-model="attr.attrIdAnvValueId">
            <el-option
              :label="item.valueName"
              v-for="(item, index) in attr.attrValueList"
              :key="item.id"
              :value="`${attr.id}:${item.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          :label="saleAttr.saleAttrName"
          v-for="(saleAttr, index) in saleArr"
          :key="saleAttr.baseSaleAttrId"
        >
          <el-select v-model="saleAttr.attrIdAndValueId">
            <el-option
              :label="item.saleAttrValueName"
              v-for="(item, index) in saleAttr.spuSaleAttrValueList"
              :key="item.id"
              :value="`${saleAttr.baseSaleAttrId}:${item.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" align="center" width="80px"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button
              @click="updateDefault(row)"
              :type="row.isDefault ? 'primary' : 'danger'"
              size="small"
              >{{ row.isDefault ? "默认图片" : "设置默认" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button size="default" @click="$emits('updateScene', 0)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
//引入获取平台属性的接口
import { reqAttrList } from "../../../../api/product/attr";
import { reqImageList, reqSpuHasSaleAttr, reqAddSku } from "../../../../api/product/spu";
import type { AttrResponseData } from "../../../../api/product/type/attr";
import type { ImageList, SaleAttrList, Spu } from "../../../../api/product/type/spu";
import { nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
//获取table组件
const table = ref<any>();

//收集新增SKU的参数
const skuParams = ref<any>({
  //父组件传递过来数据
  category3Id: "", //三级分类的ID
  spuId: "", //SPU的ID
  tmId: "", //SPU归属于哪一个品牌
  //v-model
  skuName: "", //SKU名字
  price: "", //SKU价格
  weight: "", //SKU重量
  skuDesc: "", //SKU商品的描述
  skuDefaultImg: "", //默认图片的地址
  skuAttrValueList: [
    //收集平台属性的数据
    // {
    //   attrId: "", //平台属性的ID
    //   valueId: "", //平台属性值的ID
    // },
  ],
  skuSaleAttrValueList: [
    //收集销售属性
    // {
    //   saleAttrId: "", //销售属性的ID
    //   saleAttrValueId: "", //属性值的ID
    // },
  ],
});

//存储全部平台属性
const attrArr = ref<AttrResponseData>([]);
//存储全部销售属性
const saleArr = ref<SaleAttrList>([]);
//存储照片墙的数据
const imgArr = ref<ImageList>([]);
//初始化SKU需要发请求的方法
const initAddSku = async (c1Id: number | string, c2Id: number | string, spu: Spu) => {
  reset();
  //收集父组件传递过来数据
  skuParams.value.category3Id = spu.category3Id;
  skuParams.value.spuId = spu.id;
  skuParams.value.tmId = spu.tmId;
  //获取某一个三级分类下全部平台属性
  const result1: AttrResponseData = await reqAttrList(c1Id, c2Id, spu.category3Id);
  //获取某一个SPU下拥有销售属性
  const result2: SaleAttrList = await reqSpuHasSaleAttr(spu.id as number);
  //获取某一个SPU旗下照片墙的数据
  const result3: ImageList = await reqImageList(spu.id as number);
  attrArr.value = result1;
  saleArr.value = result2;

  //照片墙数据格式做当前业务不行---动态修改数据格式
  if (result3.length) {
    for (var i = 0; i < result3.length; i++) {
      result3[i].isDefault = false;
    }
    result3[0].isDefault = true;
    //收集默认图片地址:上来第一张
    skuParams.value.skuDefaultImg = result3[0].imgUrl;
  }
  imgArr.value = result3;

  //照片墙的数据回来立马第一行的复选框勾选上
  nextTick(() => {
    table.value.toggleRowSelection(imgArr.value[0], true);
  });
};

const updateDefault = (row: any) => {
  //全部的图片isDefault=false
  imgArr.value.forEach((item) => {
    item.isDefault = false;
    table.value.toggleRowSelection(item, false);
  });
  //选中勾选
  row.isDefault = true;
  table.value.toggleRowSelection(row, true);
  //收集SKU默认图片地址
  skuParams.value.skuDefaultImg = row.imgUrl;
};

//保存按钮的回调
const save = async () => {
  //整理参数
  //发请求
  //成功
  //失败
  //平台属性的整理
  const arr1 = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAnvValueId) {
      const [attrId, valueId] = next.attrIdAnvValueId.split(":");
      prev.push({ attrId, valueId });
    }
    return prev;
  }, []);
  //销售属性的整理
  const arr2 = saleArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [saleAttrId, saleAttrValueId] = next.attrIdAndValueId.split(":");
      prev.push({ saleAttrId, saleAttrValueId });
    }
    return prev;
  }, []);
  skuParams.value.skuAttrValueList = arr1;
  skuParams.value.skuSaleAttrValueList = arr2;
  try {
    //添加SKU
    await reqAddSku(skuParams.value);
    //提示
    ElMessage({
      type: "success",
      message: "添加成功",
    });
    //通知父亲切换场景为零
    $emits("updateScene", 0);
  } catch (error) {
    //提示
    ElMessage({
      type: "error",
      message: "添加失败",
    });
  }
};

const reset = () => {
  Object.assign(skuParams.value, {
    //父组件传递过来数据
    category3Id: "", //三级分类的ID
    spuId: "", //SPU的ID
    tmId: "", //SPU归属于哪一个品牌
    //v-model
    skuName: "", //SKU名字
    price: "", //SKU价格
    weight: "", //SKU重量
    skuDesc: "", //SKU商品的描述
    skuDefaultImg: "", //默认图片的地址
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
  });
};

const $emits = defineEmits(["updateScene"]);
//对外暴露方法
defineExpose({ initAddSku });
</script>

<script lang="ts">
export default {
  name: "SkuForm",
};
</script>
<style scoped></style>
