<template>
  <!-- 卡片组件 -->
  <el-card shadow="hover">
    <el-button type="primary" :icon="Plus" @click="addTradeMark" v-has.enter="'btn.Trademark.add'">添加品牌</el-button>
    <el-button type="primary" :icon="Download" @click="download" v-has="123">导出数据</el-button>
    <!-- 表格:将来要展示已有品牌
      ---静态的搭建
      table：
          border:可以让表格竖着方向有边框
      column
          label:顶部标题
          width:列宽度
          align:center 文字对齐方式
    
    -->
    <el-table border style="margin: 20px 0px" :data="tradeMarkArr">
      <el-table-column
        label="序号"
        width="80"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <el-button
            type="warning"
            size="small"
            :icon="Edit"
            @click="updateTradeMark(row)"
            v-has="'btn.Trademark.update'"
           
          ></el-button>

          <el-popconfirm
            :title="`你确定要删除${row.tmName}?`"
            icon-color="red"
            :icon="Delete"
            width="250px"
            @confirm="deleteTradeMark(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" :icon="Delete"   v-has="'btn.Trademark.remove'"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      layout="prev, pager, next, jumper,->,sizes,total"
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :total="total"
      :background="true"
      @current-change="getTradeMarkList"
      @size-change="sizeHandler"
    />

    <!-- 对话框:新增品牌|修改已有品牌结构 -->
    <el-dialog
      v-model="showDialog"
      style="margin-top: 100px"
      :title="tradeMark.id ? '更新品牌' : '添加品牌'"
    >
      <el-form
        ref="formRef"
        label-width="100px"
        style="width: 80%"
        :model="tradeMark"
        :rules="rules"
      >
        <!-- 表单元素 -->
        <el-form-item label="品牌名称" prop="tmName">
          <el-input
            type="text"
            placeholder="请你输入品牌名称"
            v-model="tradeMark.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- 
          action:上传图片的请求地址 上传图片post 需要代理跨域 app-dev 
          show-file-list:显示上传文件的名字
        
        -->
          <el-upload
            class="avatar-uploader"
            action="/app-dev/admin/product/fileUpload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="tradeMark.logoUrl" :src="tradeMark.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <!-- 具名插槽:放置确定与取消按钮 -->
        <el-button size="default" @click="showDialog = false">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { Plus, Download, Edit, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  reqTradeMark,
  reqAddOrUpdateTradeMark,
  reqDeleteById,
} from "../../../api/product/trademark";
import type {
  TradeMarkResponseData,
  Records,
  TradeMark,
} from "../../../api/product/type/trademark";

//分页器当前页码-默认第一页
const pageNo = ref<number>(1);
//分页器当前显示数据条数--默认三个
const pageSize = ref<number>(3);
//存储全部的已有品牌的数据
const tradeMarkArr = ref<Records>([]);
//存储分页器需要总条数
const total = ref<number>(0);
//控制对话框的显示与隐藏的属性
const showDialog = ref<boolean>(false);
//获取el-form组件实例
const formRef = ref<any>();
//收集新增品牌的数据
var tradeMark = reactive<TradeMark>({
  tmName: "", //收集新增品牌名称
  logoUrl: "", //收集新增品牌图片地址
});

//组件挂载完毕
onMounted(() => {
  //立马获取一次已有品牌的数据
  getTradeMarkList();
});

//获取已有品牌的数据
const getTradeMarkList = async (value: number = 1) => {
  //收集分页器用户当前选中页码数组
  pageNo.value = value;
  //获取已有品牌的数据
  let result: TradeMarkResponseData = await reqTradeMark(pageNo.value, pageSize.value);
  //存储已有的品牌数据
  tradeMarkArr.value = result.records;
  //存储总条数
  total.value = result.total;
};

//分页器下拉框的自定义事件
const sizeHandler = (value: number) => {
  //value:即为用选择下拉框对应数值[3,5,7,9]
  //修改每一个需要展示数据条数
  pageSize.value = value;
  //再次发请求
  getTradeMarkList();
};

//添加品牌按钮的回调
const addTradeMark = () => {
  //显示对话框之前清空数据
  reset();
  //显示对话框
  showDialog.value = true;
  //清空表单校验的结果
  resetFiledResult();
};

//更新已有的品牌
//row:已有的品牌
const updateTradeMark = (row: TradeMark) => {
  //将已有的品牌数据赋值给tradeMark
  tradeMark.id = row.id;
  tradeMark.tmName = row.tmName;
  tradeMark.logoUrl = row.logoUrl;
  //显示对话框
  showDialog.value = true;
};

//上传图片组件之上传请求之前的钩子回调
//上传文件格式:png|jpg|gif  大小2M
const beforeAvatarUpload = (file: any) => {
  if (file.type == "image/png" || file.type == "image/gif" || file.type == "image/jpeg") {
    //判断文件的大小
    if (file.size / 1024 / 1024 < 1) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传大小不能超出2M",
      });
      return false;
    }
  } else {
    //上传失败的提示
    ElMessage({
      type: "error",
      message: "上传文件格式不正确",
    });
    //不上传
    return false;
  }
};

//图片上传成功的工资
const handleAvatarSuccess = (response: any, file: any) => {
  //response:即为上传图片post 请求返回的数据
  //file:即为上传图片对象
  tradeMark.logoUrl = response.data;
  //图片上传成功清除校验结果
  formRef.value.clearValidate("logoUrl");
};

//点击确定按钮发请求
const confirm = async () => {
  //收集参数
  //发请求
  //成功
  //失败
  //通过form组件实例的validate方法进行全部的表单校验
  //validate方法执行:会返回一个Promise->成功(全部表单相校验成功)、失败(只要有一个表单相校验失败)
  await formRef.value.validate();
  try {
    //添加品牌成功||修改品牌成功
    await reqAddOrUpdateTradeMark(tradeMark);
    //关闭对话框
    showDialog.value = false;
    //提示
    ElMessage({
      type: "success",
      message: tradeMark.id ? "更新成功" : "添加成功",
    });
    //再次获取全部已有的品牌
    //更新留在当前页、添加留在第一页
    getTradeMarkList(tradeMark.id ? pageNo.value : 1);
  } catch (error) {
    ElMessage({
      type: "error",
      message: tradeMark.id ? "更新失败" : "添加失败",
    });
  }
};

//清空收集品牌的数据
const reset = () => {
  tradeMark.id = 0;
  tradeMark.tmName = "";
  tradeMark.logoUrl = "";
};

//清空表单校验的结果
const resetFiledResult = () => {
  formRef.value?.clearValidate("tmName");
  formRef.value?.clearValidate("logoUrl");
};
/*****************************************表单校验************************************/
/**
 * required:代表这个字段务必校验 ---表单相文字前面会出现五角星
 * min:设置文本元素字符最小个数
 * max:设置字符最大个数
 * message:错误消息的提示
 * trigger:触发校验的实际  blur 失却焦点  change 文本发生变化
 * **/
//书写自定义校验规则(品牌名称)
const validatorTmName = (rule: any, value: any, callBack: any) => {
  //规则对象没有实际用途 rule
  //表单内容  value
  //放行函数 callBack
  //符合条件
  if (/^[\u4e00-\u9fa5]{2,}$/.test(value)) {
    callBack();
  } else {
    //不符合条件
    callBack(new Error("品牌名称至少两位汉字"));
  }
};

//校验logo图片
const validatorLogoUrl = (rule: any, value: any, callBack) => {
  //value即为上传图片地址:如果有放行
  if (value) {
    callBack();
  } else {
    //value即为上传图片地址:如果没有返回错误信息
    callBack(new Error("请上传图片LOGO"));
  }
};

const rules = {
  //校验品牌的名字
  tmName: [{ required: true, trigger: "blur", validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
};

//删除已有品牌的方法
const deleteTradeMark = async (id: number) => {
  try {
    //删除已有品牌
    await reqDeleteById(id);
    //提示
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    //再次获取全部已有品牌数据
    getTradeMarkList(pageNo.value);
  } catch (error) {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};

import * as XLSX from "xlsx";

//导出excel
const download = () => {
  //将JSON数据转换为excel需要格式
  const worksheet = XLSX.utils.json_to_sheet(tradeMarkArr.value);
  //准备文件容器
  const workbook = XLSX.utils.book_new();
  //把数据追加到excel容器当中
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
  //导出数据
  XLSX.writeFile(workbook, "boos.xlsx");
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>


<style scoped>
  .el-button{
    background:green;
  }

  ::v-deep(.el-button span){
    color: yellowgreen;
  }

  ::v-deep(.is-active){
    background: orange !important;
  }
</style>