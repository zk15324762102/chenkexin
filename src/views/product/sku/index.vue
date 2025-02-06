<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column
        type="index"
        width="80px"
        align="center"
        label="序号"
      ></el-table-column>
      <el-table-column label="名称" width="180px" prop="skuName"></el-table-column>
      <el-table-column label="描述" width="180px" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="180px">
        <!-- 代表SKU:商品 -->
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量" width="180px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="180px" prop="price"></el-table-column>
      <el-table-column label="操作" width="280px" fixed="right">
        <template #="{ row, $index }">
          <el-button
            @click="changeSale(row)"
            :type="row.isSale ? 'warning' : 'danger'"
            size="small"
            :icon="row.isSale ? Bottom : Top"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            :icon="Edit"
            @click="updateSku(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            :icon="InfoFilled"
            @click="findSku(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            :icon="Delete"
            @click="removeSku(row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      background
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasSku"
      @size-change="sizeHandler"
    />

    <!-- 抽屉组件 -->
    <el-drawer v-model="showDrawer" title="查看商品的详情">
      <el-divider content-position="left">商品信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-divider content-position="left">商品描述</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">商品描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-divider content-position="left">商品价格</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">商品价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-divider content-position="left">平台属性</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin: 4px"
            v-for="(item, index) in skuInfo.skuAttrValueList"
            :key="item.id"
            >{{ item.valueName }}</el-tag
          >
        </el-col>
      </el-row>
      <el-divider content-position="left">销售属性</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">销售属性</el-col>
        <el-col :span="16">
          <el-tag
            round
            style="margin: 4px"
            v-for="(item, index) in skuInfo.skuSaleAttrValueList"
            :key="item.id"
            >{{ item.saleAttrValueName }}</el-tag
          >
        </el-col>
      </el-row>
      <el-divider content-position="left">商品图片</el-divider>
      <el-row :gutter="20">
        <el-col :span="8">商品图片</el-col>
        <el-col :span="16">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  reqSkuList,
  reqCancelSale,
  reqSkuSale,
  reqSkuInfo,
  reqDeleteSku,
} from "@/api/product/sku";
import { Top, Bottom, Edit, Delete, InfoFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
//分页器默认的页码
const pageNo = ref<number>(1);
//每一页数据的条数
const pageSize = ref<number>(10);
//控制抽屉的显示与隐藏
const showDrawer = ref<boolean>(false);
//存储全部商品
const skuArr = ref<any>([]);
//存储商品的信息
const skuInfo = ref<any>({});
//存储商品的总个数
const total = ref<any>(0);
//组件挂载完毕
onMounted(() => {
  getHasSku(1);
});
//获取SKU列表的接口封装一个函数
const getHasSku = async (value: number = 1) => {
  //收集当前页码
  pageNo.value = value;
  const result: any = await reqSkuList(pageNo.value, pageSize.value);
  skuArr.value = result.records;
  total.value = result.total;
};
//分页器下拉菜单的自定义事件回调
const sizeHandler = (val: number) => {
  //收集每一页展示多少条数据
  pageSize.value = val;
  //再次获取对应页数的商品的数据
  getHasSku();
};

//当前用户操作的商品
const changeSale = async (row: any) => {
  //判断当前商品是上架还是下架
  if (row.isSale == 1) {
    await reqCancelSale(row.id);
    //提示消息
    ElMessage({
      type: "success",
      message: "下架成功",
    });
  } else {
    await reqSkuSale(row.id);
    //提示消息
    ElMessage({
      type: "success",
      message: "上架成功",
    });
  }
  //修改完上架与下架的状态留在当前页
  getHasSku(pageNo.value);
};
//更新已有的SKU
const updateSku = (row: any) => {
  ElMessage({
    type: "success",
    message: "程序要在努力开发....",
  });
};

//查看商品信息
const findSku = async (row: any) => {
  //抽屉显示出来
  showDrawer.value = true;
  const result = await reqSkuInfo(row.id);
  skuInfo.value = result;
};

//删除SKU商品
const removeSku = (id: number) => {
  reqDeleteSku(id).then(() => {
      ElMessage({
        type:'success',
        message:'删除成功'
      });
      //再次获取剩下SKU数据
      getHasSku(pageNo.value);
  });
};
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

::v-deep .el-carousel__button {
  width: 10px;
  height: 10px;
  background: yellowgreen;
  border-radius: 50%;
}
</style>
