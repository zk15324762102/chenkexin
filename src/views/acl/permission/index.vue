<template>
  <div>
    <!-- 
      code: "Acl" // 标识名称
      deleted: false
      gmtCreate: "2020-11-30 16:40:08"
      gmtModified: "2020-11-30 16:40:08"
      id: "1333329957008228353"
      level: 2
      name: "权限管理"
      pid: "1" // 所属节点的id
      select: false
      status: null
      toCode: ""
      type: 1  // 1: 路由 2: 按钮
      children: []
    -->
    <!-- 
      code: "btn.Role.assgin"
      deleted: false
      gmtCreate: "2020-11-30 16:50:13"
      gmtModified: "2020-12-01 08:13:47"
      id: "1333332492158812161"
      level: 4
      name: "分配权限"
      pid: "1333330152781561858"
      select: false
      status: null
      toCode: "RoleAuth"
      type: 2
     -->
    <el-table border style="margin-bottom: 20px;" :data="menuPermissionList" :expand-row-keys="expandKeys" row-key="id">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />

      <el-table-column prop="toCode" label="跳转权限值" />

      <el-table-column label="操作">
        <template v-slot="{row}">

          <el-button :disabled="row.level===4" type="primary" :icon="Plus" size="small" @click="toAddPermission(row)" :title="getAddTitle(row.level)" />

          <el-button type="primary" :icon="Edit" size="small" :disabled="row.level===1" @click="toUpdatePermission(row)" :title="row.level===4 ? '修改功能' : '修改菜单'" />

          <el-button :disabled="row.level===1" type="danger" :icon="Delete" size="small" @click="removePermission(row)" title="删除" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" @close="resetData">

      <el-form ref="permissionRef" :model="permission" :rules="permissionRules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="permission.name" />
        </el-form-item>

        <el-form-item label="功能权限值" prop="code">
          <el-input v-model="permission.code" />
        </el-form-item>

        <el-form-item label="跳转路由权限值" prop="toCode" v-if="permission.level===4">
          <el-input v-model="permission.toCode" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="resetData">取 消</el-button>
        <el-button type="primary" @click="addOrUpdatePermission">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Permission'
}
</script>

<script lang="ts" setup>
// 1. 树行表格
//    * table展示数据menuPermissionList, 每一行是一个row, 需要数据有 row 中包含 children
//    * 需要给 el-table 组件设置 row-key 属性, row-key属性的作用作为表格中数据的唯一标识
//      row-key="id" ---->   将 row(每行展示的数据)中的字段 id 作为这一行数据的唯一标识
//    * expand-row-keys 设置表格默认展开的是哪一行
//      expand-row-keys 这个的属性值是一个数组,数字中放需要展开行的 row-key 标识(唯一标识)
//      expand-row-keys="menuPermissionList[0].id"
// 2. 保存数据
// level 字段 代表的是等级的意思
// level 支持 1, 2, 3, 4
//    1, 2, 3 代表的都是菜单,此时type值应该是1
//    4 代表的是按钮,此时type值应该是2
// type值是1,代表的是菜单,最后拥有这个权限的时候,数据会展示在当前用户返回的个人信息的 routes 中
// type值是2,代表的是按钮,最后拥有这个权限的时候,数据会展示在当前用户返回的个人信息的 buttons 中
// 注意:
// 个人信息中 buttons 这个数组用来做按钮级别的权限
// 什么是按钮级别的权限?我们之前做的权限叫什么?
// 答:
// 我们之前做的权限叫菜单级别的权限
// 按钮级别的权限:
//    举个例子: 我是产品总监,那么此时我可以[操作]"产品管理"所有页面的功能
//             现在有一个实习生来了公司,那么实习生需要熟悉公司业务,需要给实习生分配权限,需要让实习生看到"产品管理"的所有页面
//             但是存在风险,万一这个实习生把数据修改了呢,实习生把"品牌管理"中的某个品牌改错了,这个责任谁来负责?
//              这个责任谁也付不起,给实习生开菜单权限,不开按钮权限,让实习声看到页面,但是不显示按钮即可
//              这就叫按钮级别的权限
//    按钮级别的权限会在最后说

  import { ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem, ElInput, type FormInstance, ElMessage, ElMessageBox } from "element-plus";
  import {Plus, Edit, Delete} from '@element-plus/icons-vue'
  import { reactive, ref, computed, onMounted, nextTick } from "vue";
  import type { PermissionListModel, PermissionModel, PermissionLevelModel } from "@/api/acl/model/permissionModel";
  import { getPermissionListApi, removePermissionApi, saveOrUpdatePermissionApi } from "@/api/acl/permission";
  const permissionRef = ref<FormInstance>()

  const menuPermissionList = ref<PermissionListModel>([])
  const expandKeys = ref<string[]>([])
  const dialogVisible = ref<boolean>(false)
  const permission = reactive<PermissionModel>({ // 要操作的菜单权限对象
        type: 1,
        level: 0,
        name: '',
        code: '',
        toCode: ''
  })

  onMounted(() => {
    fetchPermissionList()
  })

  /* 
  动态计算得到Dialog的标题
  */
  const dialogTitle = computed(() => {
    const {id, level} = permission
    if (id) {
      return level===4 ? '修改功能' : '修改菜单'
    } else {
      return level===4 ? '添加功能' : '添加菜单'
    }
  })

  /* 
  根据权限的等级来计算确定校验规则
  */
  const permissionRules = computed(() => {
    // 菜单权限校验的规则
    const menuRules = { 
      name: [{required: true, message: '名称必须输入'}],
      code: [{required: true, message: '权限值必须输入'}],
    }
    // 按钮功能权限校验的规则
    const btnRules = { 
      name: [{required: true, message: '名称必须输入'}],
      code: [{required: true, trigger: 'blur', message: '功能权限值必须输入'}]
    }
    console.log('permissionRules')
    return permission.level===4 ? btnRules : menuRules
  })

  /* 
  根据级别得到要显示的添加dialog的标题
  */
  const getAddTitle = (level: number) => {
    if (level===1 || level===2) {
      return '添加菜单'
    } else if (level===3){
      return '添加功能'
    }
  }

  /* 
  请求获取权限菜单数据列表
  */
  const fetchPermissionList = async () => {
    const result = await getPermissionListApi()
    menuPermissionList.value = result.children
    expandKeys.value = [menuPermissionList.value[0].id as string]
  }

  /* 
  显示添加权限的界面(菜单或功能)
  */
  const toAddPermission = (row: PermissionModel) => {
    dialogVisible.value = true
    permission.pid = row.id    // pid ==> parentId 父权限数据的id
    permission.level = (row.level + 1) as PermissionLevelModel
    permission.type = permission.level===4 ? 2 : 1
    
    // 清除校验(必须在界面更新之后)
    // 注意: 校验规则是动态的, nextTick清除后还会显示错误信息, 应该是在nextTick后进行了校验
    /* nextTick(() => {
      console.log('nextTick')
      permissionRef.value?.clearValidate()
    }) */
    setTimeout(() => {
      permissionRef.value?.clearValidate()
    }, 0);
  }

  /* 
  显示菜单添加或更新的dialog
  */
  const toUpdatePermission = (row: PermissionModel) => {
    dialogVisible.value = true
    Object.assign(permission, row)
    permission.type = permission.level===4 ? 2 : 1

    // 清除校验(必须在界面更新之后)
    // nextTick(() => permissionRef.value?.clearValidate())
    setTimeout(() => {
      permissionRef.value?.clearValidate()
    }, 0);
  }

  /* 
  删除某个权限节点
  */    
  const removePermission = (permission: PermissionModel) => {
    
    ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
      type: 'warning'
    }).then(async () => {
      await removePermissionApi(permission.id as string)
      ElMessage.success('删除成功!')
      fetchPermissionList()
    }).catch((error) => {
      if (error==='cancel') {
        ElMessage({
          type: 'info',
          message: '已取消删除'
        })
      }
    })
  }

  /* 
  添加或更新功能权限
  */
  const addOrUpdatePermission = () => {
    permissionRef.value?.validate(async valid => {
      if (valid) {
        const { id } = permission

        await saveOrUpdatePermissionApi(permission)
        ElMessage.success(`${id ? '修改' : '添加'}成功!`)
        resetData()
        fetchPermissionList()
      }
    })
  }

  /* 
  重置数据
  */
  const resetData = () => {
    dialogVisible.value = false
    Object.assign(permission, {
      type: 1,
      level: 0,
      name: '',
      code: '',
      toCode: ''
    })
  }

</script>
