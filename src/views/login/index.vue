<template>
  <div class="login-container">
    <el-form ref="formRef" :model="loginForm" :rules="loginRules" class="login-form">
      <!-- 项目的标题 -->
      <div class="title-container">
        <h3 class="title">尚品汇后台管理</h3>
      </div>
      <!-- 账号的表单 -->
      <el-form-item prop="username">
        <!-- 账号前面的小图标 -->
        <span class="svg-container">
          <svg-icon name="ele-UserFilled" />
        </span>
        <!-- 账号的表单元素 -->
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请你输入账号"
        />
      </el-form-item>
      <!-- 密码的表单 -->
      <el-form-item prop="password">
        <!-- 密码前面的小图标锁头 -->
        <span class="svg-container">
          <svg-icon name="ele-Lock" />
        </span>
        <el-input
          :key="passwordType"
          ref="passwordRef"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请你输入密码"
          @keyup.enter="handleLogin"
        />
        <!-- 密码后面的图标 -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon :name="passwordType === 'password' ? 'ele-Hide' : 'ele-View'" />
        </span>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px; height: 40px"
        @click.prevent="handleLogin"
        >登 陆</el-button
      >
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useUserInfoStore } from "@/stores/userInfo";
import type { FormInstance } from "element-plus";
import { nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
//获取用户相关的仓库
const userInfoStore = useUserInfoStore();
//获取路由
const route = useRoute();
//获取路由器
const router = useRouter();
//收集账号与密码的数据
const loginForm = ref({
  username: "admin", //账号
  password: "111111", //收集密码
});
//控制按钮加载效果:默认不加载
const loading = ref(false);
//密码表单元素type属性需要响应式数据:默认密码
const passwordType = ref("password");
//重定向
const redirect = ref("");
//获取密码的组件实例
const passwordRef = ref<HTMLInputElement>();
//获取el-form组件实例
const formRef = ref<FormInstance>();
//表单校验的回调方法:验证用户的名字
const validateUsername = (rule: any, value: any, callback: any) => {
  //rule:即为规则对象->数组里面的元素
  //value:即为文本的内容
  //callBack:放行函数
  if (value.length >= 5) {
    //符合条件:立马放行
    callback();
  } else {
    //不符合条件
    callback(new Error("账号至少五位"));
  }
};
//验证密码
const validatePassword = (rule: any, value: any, callback: any) => {
  //密码数字至少六位
  if (/^\d{6,}$/.test(value)) {
    callback();
  } else {
    //不符合条件的
    callback(new Error("密码至少六位"));
  }
};
//表单校验:规则对象
const loginRules = {
  //右侧属性,代表包含规则对象的(一个字段可以有多个规则)
  //required:代表的是这个字段务必校验(一般前面会出现五角星)
  //trigger:触发校验的时机：blur失却焦点 、change 文本变化
  //validator:自定义校验规则回调函数
  username: [{ required: true, trigger: "change", validator: validateUsername }],
  password: [{ required: true, trigger: "blur", validator: validatePassword }],
};

watch(route,() => {
  //收集路由上query参数
    redirect.value = route.query && (route.query.redirect as string);
  },
  { immediate: true }
);

/* 
 点击密码后面的眼睛图标
*/
const showPwd = () => {
  //点击眼睛来回切换passwordType数值
  passwordType.value == "password"
    ? (passwordType.value = "text")
    : (passwordType.value = "password");
  //点击小眼睛:让input组件聚焦
  nextTick(() => {
    passwordRef.value?.focus();
  });
};

//密码表单enter|点击登录按钮进行登录
const handleLogin = async () => {
  //点击登录按钮:通过el-form组件实例validate方法进行判断,判断全部表单是否符合条件！！！
  await formRef.value?.validate();
  //按钮加载效果开始转动
  loading.value = true;
  //获取表单元素收集内容:账号与密码
  const { username, password } = loginForm.value;
  try {
    //用户小仓库调用login方法进行用户登录
    await userInfoStore.login(username, password);
    //编程式导航进行路由跳转
    router.push({ path: redirect.value|| "/" });
  } finally {
    //不关登录成功、失败，加载效果关闭
    loading.value = false;
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  background-image: url(../../assets/bg.jpg);
  background-color: #2d3a4b;
  background-size: cover;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    .el-input__wrapper {
      width: 100%;
      background-color: transparent;
      box-shadow: none;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
