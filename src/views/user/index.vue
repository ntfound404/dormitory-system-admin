<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <h2 class="page-title">用户管理系统</h2>
        <div class="search-section">
          <el-form
            class="search-form"
            ref="queryForm"
            :model="userQueryData"
            layout="inline"
          >
            <div class="form-row">
              <el-form-item label="登录名称">
                <el-input
                  v-model="userQueryData.username"
                  placeholder="请输入登录名称"
                  clearable
                />
              </el-form-item>
              <el-form-item label="用户昵称">
                <el-input
                  v-model="userQueryData.nickname"
                  placeholder="请输入用户昵称"
                  clearable
                />
              </el-form-item>
              <el-form-item label="用户邮箱">
                <el-input
                  v-model="userQueryData.email"
                  placeholder="请输入用户邮箱"
                  clearable
                />
              </el-form-item>
            </div>
          </el-form>
          <div class="button-group">
            <el-button type="primary" @click="handleSearch()" :icon="Search">查询</el-button>
            <el-button @click="resetSearch()" :icon="Refresh">重置</el-button>
            <el-button type="success" @click="openAddDialog()" :icon="Plus">添加用户</el-button>
          </div>
        </div>
      </div>
    </template>

    <el-table
      :data="userList"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      v-loading="tableLoading"
    >
      <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
      <el-table-column
        label="登录名称"
        prop="username"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="用户昵称" prop="nickname" align="center"></el-table-column>
      <el-table-column label="用户邮箱" prop="email" align="center"></el-table-column>
      <el-table-column label="用户角色" prop="role" align="center">
        <template #default="{ row }">
          <div v-if="row.id === 1">
            <span>{{ row.role }}</span>
          </div>
          <div v-else>
            <el-select
              v-model="row.role"
              placeholder="请选择角色"
              @change="handleRoleChange(row)"
            >
              <el-option
                v-for="(roleName, role) in roleList"
                :key="role"
                :label="roleName"
                :value="role"
              ></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdTime" align="center"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template #default="{ row }">
          <el-button
            v-if="row.id !== 1"
            :icon="Edit"
            circle
            type="primary"
            @click="showDialog(row)"
            size="small"
          ></el-button>
          <el-button
            v-if="row.id !== 1"
            :icon="Delete"
            circle
            type="danger"
            @click="deleteUser(row)"
            size="small"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加用户弹窗 -->
    <el-dialog v-model="userDialogVisible" :title="title" width="500px" destroy-on-close>
      <el-form
        ref="formRef"
        :model="userData"
        :rules="rules"
        label-width="100px"
        style="max-height: 60vh; overflow-y: auto"
      >
        <el-form-item label="登录账号" prop="username">
          <el-input 
            v-model="userData.username" 
            placeholder="请输入登录账号"
            minlength="5" 
            maxlength="16"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input 
            v-model="userData.password" 
            placeholder="请输入登录密码"
            type="password"
            minlength="1" 
            maxlength="15"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input 
            v-model="userData.rePassword" 
            placeholder="请再次输入密码"
            type="password"
            minlength="1" 
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser()">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑用户弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="500px" destroy-on-close>
      <el-form
        ref="editFormRef"
        :model="userModel"
        :rules="editRules"
        label-width="100px"
        style="max-height: 60vh; overflow-y: auto"
      >
        <el-form-item label="登录账号" prop="username">
          <el-input
            v-model="userModel.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input 
            v-model="userModel.nickname" 
            placeholder="请输入用户昵称"
            minlength="2" 
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input 
            v-model="userModel.email" 
            placeholder="请输入用户邮箱"
            minlength="1" 
            maxlength="20"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUser()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { Edit, Delete, Search, Plus, Refresh } from "@element-plus/icons-vue";
import {
  userListService,
  addUserService,
  userRoleService,
  userUpdateService,
  deleteUserService,
  adminUpdateService,
  queryUsersService,
} from "@/api/user.js";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useTokenStore } from "@/stores/token.js";

// 标题
const title = ref("添加用户");

// 角色映射
const roleMap = {
  1: "超级管理员",
  2: "管理员",
  3: "学生",
};

// 角色列表
const roleList = {
  2: "管理员",
  3: "学生",
};

// 表格数据
const userList = ref([]);
const tableLoading = ref(false);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 查询参数
const userQueryData = ref({
  username: "",
  nickname: "",
  email:"",
  pageNum: 1,
  pageSize: 10
});

// 用户数据
const userData = ref({
  username: "",
  password: "",
  rePassword: "",
  role: ""
});

const userModel = ref({
  id: null,
  username: "",
  nickname: "",
  email: ""
});

// 权限判断
const permissions = ref("");
const getPermissions = () => {
  const tokenStore = useTokenStore();
  permissions.value = tokenStore.token.roles;
};
getPermissions();

// 校验密码的函数
const checkRePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次确认密码"));
  } else if (value !== userData.value.password) {
    callback(new Error("请确保两次输入的密码一样"));
  } else {
    callback();
  }
};

// 添加用户表单校验
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 16, message: "长度为5~16位非空字符", trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  rePassword: [{ required: true, validator: checkRePassword, trigger: "blur" }],
  role: [{ required: true, message: "请选择用户角色", trigger: "change" }]
};

// 编辑表单校验规则
const editRules = {
  nickname: [
    { required: true, message: "请输入用户昵称", trigger: "blur" },
    {
      pattern: /^\S{2,10}$/,
      message: "昵称必须是2-10位的非空字符串",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入用户邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
};

// 表单引用
const formRef = ref(null);
const editFormRef = ref(null);
const userDialogVisible = ref(false);
const dialogVisible = ref(false);

// 获取用户列表
const getUserList = async () => {
  tableLoading.value = true;
  try {
    // 构建查询参数
    const queryParams = {
      ...userQueryData.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    };
    
    // 调用查询服务
    const result = await queryUsersService(queryParams);
    
    if (result.code === 0) {
      // 处理角色显示
      userList.value = (result.data.records || []).map((user) => {
        if (typeof user.role === 'number') {
          user.role = roleMap[user.role] || "未知角色";
        }
        return user;
      });
      total.value = result.data.total || 0;
    } else {
      ElMessage.error(result.message || "获取用户列表失败");
    }
  } catch (error) {
    console.error("获取用户列表失败:", error);
    ElMessage.error("获取用户列表失败");
  } finally {
    tableLoading.value = false;
  }
};

// 打开添加用户弹窗
const openAddDialog = () => {
  title.value = "添加用户";
  clearData();
  userDialogVisible.value = true;
};

// 清空数据
const clearData = () => {
  userData.value = {
    username: "",
    password: "",
    rePassword: "",
    role: ""
  };
};

// 添加用户
const addUser = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let result = await addUserService(userData.value);
        if (result.code === 0) {
          ElMessage.success(result.message || "添加用户成功");
          userDialogVisible.value = false;
          await getUserList();
        } else {
          ElMessage.error(result.message || "添加用户失败");
        }
      } catch (error) {
        console.error("添加用户失败:", error);
        ElMessage.error("添加用户失败");
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

// 更新用户
const updateUser = async () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 根据权限选择不同的更新方法
        const updateService = permissions.value === 'admin' ? adminUpdateService : userUpdateService;
        let result = await updateService(userModel.value);
        
        if (result.code === 0 || result.msg) {
          ElMessage.success(result.message || result.msg || "更新成功");
          dialogVisible.value = false;
          await getUserList();
        } else {
          ElMessage.error(result.message || "更新失败");
        }
      } catch (error) {
        console.error("更新用户失败:", error);
        ElMessage.error("更新用户失败");
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

// 显示编辑对话框
const showDialog = (row) => {
  userModel.value = { ...row };
  dialogVisible.value = true;
};

// 删除用户
const deleteUser = (row) => {
  ElMessageBox.confirm("您确认要删除该用户吗?", "删除确认", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        let result = await deleteUserService(row.id);
        if (result.code === 0 || result.msg) {
          ElMessage.success(result.message || result.msg || "删除成功");
          await getUserList();
        } else {
          ElMessage.error(result.message || "删除失败");
        }
      } catch (error) {
        console.error("删除用户失败:", error);
        ElMessage.error("删除用户失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 处理角色变更
const handleRoleChange = async (row) => {
  try {
    let result = await userRoleService({
      userId: row.id,
      roleId: row.role,
    });
    if (result.code === 0 || result.msg) {
      ElMessage.success(result.message || result.msg || "角色修改成功");
      await getUserList();
    } else {
      ElMessage.error(result.message || "角色修改失败");
    }
  } catch (error) {
    console.error("修改用户角色失败:", error);
    ElMessage.error("修改用户角色失败");
  }
};

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  getUserList();
};

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getUserList();
};

// 查询用户
const handleSearch = () => {
  currentPage.value = 1;
  getUserList();
};

// 重置查询条件
const resetSearch = () => {
  userQueryData.value = {
    username: "",
    nickname: "",
    email: "",
    pageNum: 1,
    pageSize: 10
  };
  currentPage.value = 1;
  getUserList();
};

// 初始化
getUserList();
</script>

<style scoped>
.page-container {
  padding: 10px;
}

.page-title {
  margin: 0;
  padding: 0;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>