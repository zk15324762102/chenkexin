<template>
  <!-- 分类全局组件:一级、二级、三级 -->
  <Category :scene="scene"></Category>
  <!-- 底部展示已有的SPU:类 -->
  <el-card style="margin: 10px 0px">
    <!-- 首页显示 -->
    <div v-show="scene == 0">
      <el-button
        type="primary"
        :icon="Plus"
        :disabled="categoryStore.c3Id ? false : true"
        @click="addSpu"
        >添加SPU</el-button
      >
      <!-- 表格展示已有的SPU -->
      <el-table border style="margin: 10px 0px" :data="spuArr" v-if="spuArr.length">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="SPU名称"
          :resizable="false"
          prop="spuName"
        ></el-table-column>
        <!-- show-overflow-tooltip:文字表格显示... -->
        <el-table-column
          label="SPU描述"
          prop="description"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="SPU操作">
          <!-- row:代表即为某一个三级分类下已有的SPU -->
          <template #="{ row, $index }">
            <el-button
              :icon="Plus"
              type="primary"
              size="small"
              title="添加SKU"
              @click="addSku(row)"
            ></el-button>
            <el-button
              :icon="Edit"
              type="warning"
              size="small"
              title="修改SPU"
              @click="updateSpu(row)"
            ></el-button>
            <el-button
              :icon="InfoFilled"
              type="info"
              size="small"
              title="查看SKU列表"
              @click="showSku(row)"
            ></el-button>
            <el-button
              :icon="Delete"
              type="danger"
              size="small"
              title="删除SPU"
              @click="deleteSpu(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 深度选择器 -->
      <el-divider content-position="center" v-else
        ><span style="color: yellowgreen">暂无数据</span></el-divider
      >
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7]"
        background
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getHasSpuList"
        @size-change="handler"
      />
    </div>
    <!-- 更新 -->
    <SpuForm ref="spu" v-show="scene == 1" @changeScene="changescene"></SpuForm>
    <!-- 添加 -->
    <SkuForm v-show="scene == 2" @updateScene="updateScene" ref="sku"></SkuForm>
  </el-card>

  <!-- dailog+table:展示已有的SKU商品 -->
  <el-dialog title="SKU列表" v-model="showDailog">
    <el-table border :data="skuArr" v-loading="loading">
      <el-table-column label="SKU名称" prop="skuName"></el-table-column>
      <el-table-column label="SKU价格" prop="price"></el-table-column>
      <el-table-column label="SKU重量" prop="weight"></el-table-column>
      <el-table-column label="SKU图片">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
//引入子组件
import SpuForm from "./spuForm/index.vue";
import SkuForm from "./skuForm/index.vue";
import { ref, watch } from "vue";
import { Plus, Edit, Delete, InfoFilled } from "@element-plus/icons-vue";
//获取api数据接口
import { reqSpuList, reqSkuList, reqDeleteSpu } from "../../../api/product/spu";
//引入分类仓库
import useCategoryStore from "../../../stores/category";
import type { SpuListResponseData, Records, Spu } from "../../../api/product/type/spu";
import { ElMessage } from "element-plus";
//分类需要的场景的数值
const scene = ref<number>(0);
//分页器当前页码---默认第一页
const pageNo = ref<number>(1);
//每一页展示数据的条数
const pageSize = ref<number>(3);
//获取小仓库
const categoryStore = useCategoryStore();
//存储全部已有的SPU
const spuArr = ref<Records>([]);
//存储spu总个数
const total = ref<number>(0);

const loading = ref<boolean>(true);
//获取子组件spuForm
const spu = ref<any>();

const skuArr = ref<any>([]);

const showDailog = ref<boolean>(false);
//获取子组件skuForm
const sku = ref<any>();
//监听三级分类的ID变化(还得有数值)
watch(
  () => categoryStore.c3Id,
  () => {
    //每一次三级分类发生变化,上一次存储的已有SPU(其他分类)，需要清空
    spuArr.value = [];
    categoryStore.c3Id && getHasSpuList();
  }
);
//获取已有的SPU列表数据
const getHasSpuList = async (value: number = 1) => {
  //修改页码
  pageNo.value = value;
  const result: SpuListResponseData = await reqSpuList(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id
  );
  total.value = result.total;
  spuArr.value = result.records;
};

//分页器下拉菜单自定义事件回调
const handler = (value: number) => {
  //收集每一展示数据条数
  pageSize.value = value;
  //再次发请求
  getHasSpuList();
};
//添加SPU按钮的回调
const addSpu = () => {
  //点击切换场景为1 (添加新的SPU|更新已有的SPU)
  scene.value = 1;
  //调用子组件的方法:发请求获取全部品牌与销售属性
  spu.value.initData(categoryStore.c3Id);
};
//更新已有的SPU按钮回调
const updateSpu = (row: Spu) => {
  //切换场景为1
  scene.value = 1;
  //父组件每一个点击更新按钮:每一次都调用子组件initHasSpu方法
  spu.value.initHasSpu(row);
};

//子组件SpuForm绑定自定义事件回调---儿子给父组件传递参数
const changescene = (params: any) => {
  //切换场景
  scene.value = params.val;
  //更新添加或者更新留在当前页或者第一页
  if (params.flag == "add") {
    //添加
    getHasSpuList();
  } else {
    //更新
    getHasSpuList(pageNo.value);
  }
};

//添加SKU(类的实力)
const addSku = (row: Spu) => {
  scene.value = 2;
  //调用子组件SkuForm方法
  sku.value.initAddSku(categoryStore.c1Id, categoryStore.c2Id, row);
};

//第二个子组件自定义事件
const updateScene = (val: number) => {
  scene.value = val;
};

//查看SKU列表按钮回调
const showSku = async (row: Spu) => {
  //每一次查看SKU列表的时候把上一次数据清空
  skuArr.value = [];
  // 对话框出来
  showDailog.value = true;
  //发请求之前加载
  loading.value = true;
  //获取对应SPU旗下全部商品
  const result = await reqSkuList(row.id as number);
  skuArr.value = result;
  //发请求之后加载消失
  loading.value = false;
};

//删除SPU
const deleteSpu = async (id: number) => {
  try {
    //删除SPU成功
    await reqDeleteSpu(id);
    //提示
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getHasSpuList();
  } catch (error) {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};
</script>

<style scoped></style>
