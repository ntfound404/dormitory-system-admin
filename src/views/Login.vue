<template>
  <div class="login-container">
    <!-- 顶部背景装饰 -->
    <div class="top-decoration"></div>
    
    <!-- 主要内容区 -->
    <div class="content-wrapper">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="logo-container">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <!-- 使用已有的logo -->
        </div>
      </div>

      <!-- 右侧表单卡片 -->
      <div class="form-card">
        <div class="tab-switcher">
          <div 
            class="tab" 
            :class="{ active: !isRegister }" 
            @click="isRegister = false; clearRegisterData();"
          >
            登录
          </div>
          <div 
            class="tab" 
            :class="{ active: isRegister }" 
            @click="isRegister = true; clearRegisterData();"
          >
            注册
          </div>
        </div>

        <!-- 注册表单 -->
        <el-form
          ref="formRef"
          size="large"
          autocomplete="off"
          v-if="isRegister"
          :model="registerData"
          :rules="rules"
          class="form-content"
        >
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              placeholder="请输入用户名"
              v-model="registerData.username"
              class="custom-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
              v-model="registerData.password"
              class="custom-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="rePassword">
            <el-input
              :prefix-icon="Lock"
              type="password"
              placeholder="请再次输入密码"
              v-model="registerData.rePassword"
              class="custom-input"
            ></el-input>
          </el-form-item>
          <!-- 注册按钮 -->
          <el-form-item>
            <el-button class="submit-button" type="primary" @click="register">
              创建账号
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 登录表单 -->
        <el-form
          ref="form"
          size="large"
          autocomplete="off"
          v-else
          :model="registerData"
          :rules="rules"
          class="form-content"
        >
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              placeholder="请输入用户名"
              v-model="registerData.username"
              class="custom-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              name="password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
              v-model="registerData.password"
              class="custom-input"
            ></el-input>
          </el-form-item>
          <el-form-item class="remember-forgot">
            <el-checkbox v-model="isRemember">记住我</el-checkbox>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button class="submit-button" type="primary" @click="login">
              登录
            </el-button>
          </el-form-item>
        </el-form>

      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-decoration"></div>
  </div>
</template>

<script setup>
import { User, Lock } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { userRegisterService, userLoginService } from "@/api/user.js";
import { useTokenStore } from "@/stores/token.js";
import { useRouter } from "vue-router";

const router = useRouter();
const tokenStore = useTokenStore();

// 控制注册与登录表单的显示， 默认显示登录
const isRegister = ref(false);

// 表单引用
const formRef = ref(null);

// 定义数据模型
const registerData = ref({
  username: "",
  password: "",
  rePassword: "",
});

// 是否记住我
const isRemember = ref(false);

// 校验密码的函数
const checkRePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次确认密码"));
  } else if (value !== registerData.value.password) {
    callback(new Error("请确保两次输入的密码一样"));
  } else {
    callback();
  }
};

// 定义表单校验规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 16, message: "长度为5~16位非空字符", trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  rePassword: [{ validator: checkRePassword, trigger: "blur" }],
};

// 在组件加载时检查localStorage中是否保存了用户名
onMounted(() => {
  const savedUsername = localStorage.getItem("username");
  if (savedUsername) {
    registerData.value.username = savedUsername;
    isRemember.value = true; // 默认勾选记住我
  }
});

// 调用后台接口，完成注册
const register = async () => {
  // 校验表单
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result = await userRegisterService(registerData.value);
      if (result.code === 0) {
        ElMessage.success("注册成功");
        isRegister.value = false; // 注册成功后切换到登录界面
      } else {
        ElMessage.error(result.message ? result.message : "注册失败");
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

// 登录函数
const login = async () => {
  let result = await userLoginService(registerData.value);
  ElMessage.success(result.msg ? result.msg : "登录成功");

  tokenStore.setToken(result.data);

  // 如果勾选了"记住我"，保存用户名到localStorage
  if (isRemember.value) {
    localStorage.setItem("username", registerData.value.username);
  } else {
    localStorage.removeItem("username");
  }

  router.push("/");
};

// 清空数据模型
const clearRegisterData = () => {
  registerData.value = {
    username: "",
    password: "",
    rePassword: "",
  };
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  width: 100%;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30vh;
  background: linear-gradient(45deg, #4776E6 0%, #54d5e9 100%);
  clip-path: polygon(0 0, 100% 0, 100% 60%, 0 100%);
  z-index: 1;
}

.bottom-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20vh;
  background: linear-gradient(45deg, #54d5e9 0%, #4776E6 100%);
  clip-path: polygon(100% 0, 0 40%, 0 100%, 100% 100%);
  z-index: 1;
}

.content-wrapper {
  display: flex;
  width: 80%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #54d5e9 0%, #4A00E0 100%);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  width: 280px;
  height: 120px;
  margin-bottom: 20px;
}

.brand-name {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

.brand-slogan {
  font-size: 18px;
  opacity: 0.9;
  margin-top: 20px;
}

.form-card {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.tab-switcher {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tab {
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  color: #888;
  transition: all 0.3s ease;
}

.tab.active {
  color: #4A00E0;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #4A00E0;
}

.form-content {
  flex: 1;
}

.custom-input {
  border-radius: 8px;
  height: 50px;

  :deep(.el-input__wrapper) {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    padding: 0 15px;
  }

  :deep(.el-input__inner) {
    height: 48px;
    font-size: 16px;
  }
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 14px;
  color: #4A00E0;
}

.submit-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(45deg, #4A00E0, #54d5e9);
  border: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(142, 45, 226, 0.3);
  }
}

.social-login {
  margin-top: 30px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #888;
  font-size: 14px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ddd;
  }

  span {
    padding: 0 15px;
  }
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.social-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  i {
    font-size: 24px;
    color: #666;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    background-color: #4A00E0;

    i {
      color: white;
    }
  }
}

/* 响应式调整 */
@media (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
    width: 90%;
  }

  .brand-section {
    padding: 30px;
  }

  .logo {
    width: 80px;
    height: 80px;
  }
}
</style>