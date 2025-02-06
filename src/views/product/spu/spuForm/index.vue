<template>
  <el-form label-width="120px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请你输入SPU名称" v-model="spuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="spuParams.tmId">
        <el-option
          v-for="(trademark, index) in tradeMarkArr"
          :key="trademark.id"
          :label="trademark.tmName"
          :value="trademark.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" v-model="spuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="imgArr"
        action="/app-dev/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible" style="margin-top: 100px">
        <img
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 250px"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select v-model="unSaleIdAndValue">
        <el-option
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option> 
      </el-select>
      <el-button
        @click="addSaleAttr"
        type="primary"
        :icon="Plus"
        style="margin-left: 10px"
        :disabled="unSaleIdAndValue ? false : true"
        >添加销售属性</el-button
      >
    </el-form-item>
    <el-form-item>
      <el-table border :data="spuHasSaleArr">
        <el-table-column
          type="index"
          align="center"
          width="80px"
          label="序号"
        ></el-table-column>
        <el-table-column
          label="属性名"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>

        <el-table-column label="属性值">
          <template #="{ row, $index }">
            <el-tag
              style="margin: 5px"
              closable
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="item.id"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              >{{ item.saleAttrValueName }}</el-tag
            >
            <el-input
              @blur="toLook(row)"
              v-model="row.saleAttrValueName"
              v-if="row.showInput"
              type="text"
              placeholder="请你输入属性值"
              size="small"
              style="width: 120px"
            ></el-input>
            <el-button
              type="primary"
              :icon="Plus"
              size="small"
              v-else
              @click="toEdit(row)"
            ></el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="spuHasSaleArr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Plus, Delete } from "@element-plus/icons-vue";
import type {
  SpuListResponseData,
  Records,
  Spu,
  TradeMarkArr,
  ImageList,
  SaleAttrList,
  AllBaseSale,
  SaleAttr,
} from "../../../../api/product/type/spu";
import {
  reqAllTradeMark,
  reqImageList,
  reqSpuHasSaleAttr,
  reqBaseSale,
  reqAddOrUpdateSpu,
} from "../../../../api/product/spu";
import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";
//存储全部的品牌的数据
const tradeMarkArr = ref<TradeMarkArr>([]);
//存储照片墙的数据
const imgArr = ref<ImageList>([]);
//存储SPU已有的销售属性
const spuHasSaleArr = ref<SaleAttrList>([]);
//存储全部的销售属性
const allSaleArr = ref<AllBaseSale>([]);
//控制预览对话框的显示与隐藏
const dialogVisible = ref<boolean>(false);
//存储预览图片的地址
const dialogImageUrl = ref<string>("");
//收集到还未拥有销售属性的名字与ID
const unSaleIdAndValue = ref<string>("");
//存储已有的SPU
const spuParams = reactive<Spu>({
  category3Id: "",
  spuName: "",
  description: "",
  tmId: "",
  spuImageList: [],
  spuSaleAttrList: [],
});

//取消按钮的回调
const cancel = () => {
  //触发自定义事件
  //自定义事件类型  传递参数
  $emits("changeScene",{val:0,flag:''});
};

//定义一个方法
const initHasSpu = async (spu: Spu) => {
  //存储已有的SPU
  Object.assign(spuParams, spu);
  //spu:已有的SPU,但是不完整的
  //获取全部品牌的数据
  const result: TradeMarkArr = await reqAllTradeMark();
  //获取某一个已有的SPU照片墙的数据
  const result1: ImageList = await reqImageList(spu.id as number);
  //存储已有的SPU销售属性与属性值
  const result2: SaleAttrList = await reqSpuHasSaleAttr(spu.id as number);
  //全部销售属性
  const result3: AllBaseSale = await reqBaseSale();
  //存储数据
  //全部品牌
  tradeMarkArr.value = result;
  //全部照片墙:照片墙数据格式name、url->imgName、imgUrl
  //处理服务器返回数据格式
  const newArr: ImageList = result1.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    };
  });
  imgArr.value = newArr;
  //已有的SPU已有的销售属性与属性值
  spuHasSaleArr.value = result2;
  //存储全部品牌的全部销售属性:最大三个、颜色、版本、尺码
  allSaleArr.value = result3;
};

//过滤出当前SPU还没有的销售属性
const unSelectSaleAttr = computed(() => {
  //过滤还未拥有的销售属性
  //颜色、版本、尺码
  const result = allSaleArr.value.filter((item) => {
    //颜色、版本
    return spuHasSaleArr.value.every((item1) => {
      return item.name != item1.saleAttrName;
    });
  });
  return result;
});

//预览的钩子
const handlePictureCardPreview = (file: any) => {
  //对话框显示出来
  dialogVisible.value = true;
  //存储预览图片地址在dialog内部img显示
  dialogImageUrl.value = file.url;
};

//追加一个新的销售属性
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = unSaleIdAndValue.value.split(":");
  //新增的销售属性
  const newSaleAttr = {
    baseSaleAttrId, //新增销售属性的ID
    saleAttrName, //新增的销售属性名字
    spuSaleAttrValueList: [], //存储属性值的数组
  };
  //追加新的销售属性
  spuHasSaleArr.value.push(newSaleAttr as any);
  //立马清空收集属性的ID与属性值
  unSaleIdAndValue.value = "";
};

//点击button按钮回调->变为编辑模式展示input
const toEdit = (row: SaleAttr) => {
  //变为编辑模式展示input
  row.showInput = true;
  //收集新增的属性值的名称
  row.saleAttrValueName = "";
};

//input失却焦点事件，收集新增的属性值
const toLook = (row: SaleAttr) => {
  //非法情况判断
  //属性值不能为空
  if (row.saleAttrValueName?.trim() == "") {
    ElMessage({
      type: "error",
      message: "属性值不能为空的",
    });
    return;
  }

  //判断属性值是否有重复的
  const repeat = row.spuSaleAttrValueList?.find((item) => {
    return row.saleAttrValueName === item.saleAttrValueName;
  });

  if (repeat) {
    ElMessage({
      type: "error",
      message: "属性值不能为空的",
    });
    return;
  }

  //变为查看模式展示button
  row.showInput = false;
  //准备一个新的属性值对象
  const newSaleAttrValue = {
    baseSaleAttrId: row.baseSaleAttrId, //属性值对属于哪个属性
    saleAttrValueName: row.saleAttrValueName, //新增的属性值的名字
  };
  //添加新的属性值
  row.spuSaleAttrValueList?.push(newSaleAttrValue as any);
};

//保存按钮的回调
const save = async () => {
  //整理参数
  //照片墙的数据
  spuParams.spuImageList = imgArr.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    };
  });
  //销售属性与属性值
  spuParams.spuSaleAttrList = spuHasSaleArr.value;
  try {
    //更新或者添加的接口
    await reqAddOrUpdateSpu(spuParams);
    //提示消息
    ElMessage({
      type: "success",
      message: spuParams.id ? "更新成功" : "添加成功",
    });
    //通知父组件切换场景为1
    $emits("changeScene",{val:0,flag:spuParams.id?'update':'add'});
  } catch (error) {
    ElMessage({
      type: "error",
      message: spuParams.id ? "更新失败" : "添加失败",
    });
  }
  //成功干什么
  //失败干什么
};

//添加新的SPU方法:发请求获取全部的品牌与全部销售属性
const initData = async (c3Id: string | number) => {
  //清空数据
  reset();
  //收集三级分类的ID
  spuParams.category3Id = c3Id;
  //获取全部品牌的数据
  const result: TradeMarkArr = await reqAllTradeMark();
  //获取全部的销售属性
  const result1: AllBaseSale = await reqBaseSale();
  //存储数据
  tradeMarkArr.value = result;
  allSaleArr.value = result1;
};
//清空数据
const reset = () => {
  //清空照片墙的数据
  imgArr.value = [];
  //情况销售属性
  spuHasSaleArr.value = [];
  //清空spuParams
  Object.assign(spuParams, {
    category3Id: "",
    spuName: "",
    description: "",
    tmId: "",
    spuImageList: [],
    spuSaleAttrList: [],
    id:''
  });
};
//子传父传递需要
const $emits = defineEmits(["changeScene"]);
//对外暴露（父操作子ref。子组件需要对外暴露）
defineExpose({
  initHasSpu,
  initData,
});
</script>
<script lang="ts">
export default {
  name: "SpuForm",
};
</script>
