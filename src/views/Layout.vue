<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <header class="main-header">
      <div class="header-left">
        <div class="logo"></div>
        <h1 class="site-title">宿舍管理系统</h1>
      </div>

      <el-menu
        mode="horizontal"
        background-color="#ffffff"
        text-color="#333333"
        active-text-color="#409EFF"
        router
        class="top-menu"
      >
        <el-menu-item index="/user">
          <el-icon><Platform /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/students">
          <el-icon><Stamp /></el-icon>
          <span>学生管理</span>
        </el-menu-item>
        <el-menu-item index="/dorms">
          <el-icon><HomeFilled /></el-icon>
          <span>宿舍楼管理</span>
        </el-menu-item>
        <el-menu-item index="/attendance">
          <el-icon><Calendar /></el-icon>
          <span>考勤管理</span>
        </el-menu-item>
        <el-menu-item index="/notices">
          <el-icon><Bell /></el-icon>
          <span>公告管理</span>
        </el-menu-item>
      </el-menu>

      <div class="header-right">
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <div class="user-profile">
            <el-avatar
              :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar"
            />
            <span class="username">{{ userInfoStore.info.nickname }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="userInfo">
                <el-icon><User /></el-icon>
                <span>基本资料</span>
              </el-dropdown-item>
              <el-dropdown-item command="ResetPassword">
                <el-icon><Key /></el-icon>
                <span>重置密码</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 内容部分 -->
    <div class="main-container">
      <!-- 面包屑导航 -->
      <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>当前页面</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="welcome-text">
          <el-icon><Sunny /></el-icon>
          <span
            >欢迎回来，<strong>{{ userInfoStore.info.nickname }}</strong></span
          >
        </div>
      </div>

      <!-- 主内容区域 -->
      <main class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- 页脚部分 -->
    <footer class="main-footer">
      <div class="footer-content">
        <div class="copyright">
          <span> © {{ new Date().getFullYear() }} 宿舍管理系统</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {
  Platform,
  Stamp,
  HomeFilled,
  House,
  Bell,
  Calendar,
  User,
  Key,
  SwitchButton,
  ArrowDown,
  Sunny,
} from "@element-plus/icons-vue";
import avatar from "@/assets/default.png";
import { ref, onMounted } from "vue";
import { userInfoService } from "@/api/user.js";
import useUserInfoStore from "@/stores/userInfo.js";
import { useTokenStore } from "@/stores/token.js";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
const router = useRouter();

// 获取用户详细信息
const getUserInfo = async () => {
  try {
    let result = await userInfoService();
    userInfoStore.setInfo(result.data);
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

onMounted(() => {
  getUserInfo();
});

// 处理下拉菜单点击事件
const handleCommand = (command) => {
  if (command === "logout") {
    ElMessageBox.confirm("您确认要退出吗?", "温馨提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        // 退出登录逻辑
        tokenStore.removeToken();
        userInfoStore.removeInfo();
        router.push("/login");
        ElMessage({
          type: "success",
          message: "退出登录成功",
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "已取消退出",
        });
      });
  } else {
    router.push("/user/" + command);
  }
};
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
}

// 顶部导航栏样式
.main-header {
  height: 64px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;

  .header-left {
    display: flex;
    align-items: center;
    margin-right: 40px;

    .logo {
      width: 36px;
      height: 36px;
      background: url("@/assets/logo.png") no-repeat center / contain;
    }

    .site-title {
      margin-left: 12px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      white-space: nowrap;
    }
  }

  .top-menu {
    flex: 1;
    border-bottom: none;

    .el-menu-item {
      height: 64px;
      line-height: 64px;
      font-size: 14px;
      padding: 0 16px;

      .el-icon {
        margin-right: 4px;
        font-size: 16px;
      }

      &:hover,
      &.is-active {
        background-color: #f5f8ff;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;

    .notification-badge {
      margin-right: 24px;
      cursor: pointer;

      .notify-icon {
        font-size: 20px;
        color: #606266;
      }
    }

    .user-profile {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }

      .el-avatar {
        border: 2px solid rgba(64, 158, 255, 0.2);
      }

      .username {
        margin: 0 8px;
        font-size: 14px;
        color: #333;
      }

      .el-icon {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

// 主要内容区域样式
.main-container {
  flex: 1;
  padding: 24px;

  .breadcrumb-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .welcome-text {
      display: flex;
      align-items: center;
      color: #606266;

      .el-icon {
        color: #f7ba2a;
        margin-right: 8px;
        font-size: 18px;
      }

      strong {
        color: #303133;
        font-weight: 600;
      }
    }
  }

  .content-area {
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    min-height: calc(90vh - 200px);
  }
}

// 页脚样式
.main-footer {
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  padding: 16px 24px;

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .copyright {
      color: #909399;
      font-size: 14px;
    }

    .footer-links {
      a {
        color: #606266;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: #409eff;
        }
      }

      .separator {
        margin: 0 12px;
        color: #dcdfe6;
      }
    }
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 响应式布局
@media screen and (max-width: 1200px) {
  .main-header {
    .top-menu {
      .el-menu-item {
        padding: 0 12px;
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .main-header {
    .header-left {
      .site-title {
        display: none;
      }
    }

    .top-menu {
      .el-menu-item {
        padding: 0 8px;

        span {
          display: none;
        }

        .el-icon {
          margin-right: 0;
          font-size: 18px;
        }
      }
    }

    .header-right {
      .user-profile {
        .username {
          display: none;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .main-container {
    padding: 16px;

    .content-area {
      padding: 16px;
    }
  }

  .main-footer {
    .footer-content {
      flex-direction: column;

      .copyright {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
