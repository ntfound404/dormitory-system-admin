<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js'
import { userResetPasswordService } from "@/api/user.js";
import { ElMessage } from "element-plus";
import {useTokenStore} from '@/stores/token.js'
import { useRouter } from 'vue-router' // 引入 useRouter

const router = useRouter(); // 获取 router 实例
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
const userInfo = ref({...userInfoStore.info});

// 表单引用
const formRef = ref(null);

const rules = {
  oldPwd: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  rePwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ]
};

// 修改密码
const updateUserPwd = async () => {
  // 校验表单
  formRef.value.validate(async (valid) => {
    if (valid) {
      const { oldPwd, newPwd, rePwd } = userInfo.value;

      // 校验新密码和确认密码是否一致
      if (newPwd !== rePwd) {
        ElMessage.error("新密码和确认密码不一致");
        return;
      }

      try {
        let result = await userResetPasswordService(oldPwd, newPwd, rePwd);
        ElMessage.success(result.msg ? result.msg : "修改成功");

        //退出登录
            //1.清空pinia中存储的token以及个人信息
            tokenStore.removeToken()
            userInfoStore.removeInfo()

            //2.跳转到登录页面
            router.push('/login')
      } catch (error) {
        ElMessage.error(error.message || "修改失败");
      }
    } else {
      console.log("表单验证失败");
    }
  });
};
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>重置密码</span>
      </div>
    </template>

    <el-row>
      <el-col :span="12">
        <el-form ref="formRef" :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input v-model="userInfo.oldPwd" type="password"></el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="userInfo.newPwd" type="password"></el-input>
          </el-form-item>

          <el-form-item label="确认新密码" prop="rePwd">
            <el-input v-model="userInfo.rePwd" type="password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateUserPwd">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
