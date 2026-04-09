import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores/token.js'

import { ElMessage } from 'element-plus'

// 定义路由
const routes = [
  {
    path: '/',
    redirect: '/user', // 默认跳转到登录页面
  },
  { path: '/login', component: () => import('@/views/Login.vue') },
  {
    path: '/layout', component: () => import('@/views/Layout.vue'),
    children: [
      {
        path: '/user',
        component: () => import('@/views/user/index.vue'),
      },
      {
        path: '/user/userInfo',
        component: () => import('@/views/user/UserInfo.vue'),
      },
      {
        path: '/user/ResetPassword',
        component: () => import('@/views/user/UserResetPassword.vue'),
      },
      {
        path: '/students',
        component: () => import('@/views/students/index.vue'),
      },
      {
        path: '/dorms',
        component: () => import('@/views/dorms/index.vue'),
      },
      {
        path: '/notices',
        component: () => import('@/views/notices/index.vue'),
      },
      {
        path: '/attendance',
        component: () => import('@/views/attendance/index.vue'),
      }
    ]
  },
]

// 创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 设置全局前置守卫
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore();

  // 如果路由跳转到非登录页面，并且没有登录（即没有 token）
  if (to.path !== '/login' && !tokenStore.token) {
    ElMessage.error('请先登录');
    next('/login'); // 跳转到登录页面
  } else {
    next(); // 继续访问目标页面
  }
})

export default router

