<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <h2 class="page-title">公告管理系统</h2>
        <div class="search-section">
          <el-form
            class="search-form"
            ref="queryForm"
            :model="noticeQueryData"
            layout="inline"
          >
            <div class="form-row">
              <el-form-item label="公告标题">
                <el-input
                  v-model="noticeQueryData.title"
                  placeholder="请输入公告标题"
                  clearable
                />
              </el-form-item>
              <el-form-item label="发布人">
                <el-input
                  v-model="noticeQueryData.author"
                  placeholder="请输入发布人"
                  clearable
                />
              </el-form-item>
            </div>
          </el-form>
          <div class="button-group">
            <el-button type="primary" @click="handleSearch()" :icon="Search">查询</el-button>
            <el-button @click="resetSearch()" :icon="Refresh">重置</el-button>
            <el-button type="success" @click="openAddDialog()" :icon="Plus">添加公告</el-button>
            <el-button
              type="danger"
              :disabled="multipleSelection.length === 0"
              @click="batchDeleteNotices()"
              :icon="Delete"
            >批量删除</el-button>
          </div>
        </div>
      </div>
    </template>

    <el-table
      :data="noticeList"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      @selection-change="handleSelectionChange"
      v-loading="tableLoading"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
      <el-table-column
        label="公告标题"
        prop="title"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="公告内容"
        prop="content"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="发布人" prop="author" align="center"></el-table-column>
      <el-table-column label="发布时间" prop="createdTime" align="center"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            type="primary"
            @click="showDialog(row)"
            size="small"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            type="danger"
            @click="deleteNotice(row)"
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

    <!-- 添加/编辑公告弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="500px" destroy-on-close>
      <el-form
        ref="formRef"
        :model="noticeData"
        :rules="rules"
        label-width="100px"
        style="max-height: 60vh; overflow-y: auto"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input
            v-model="noticeData.title"
            placeholder="请输入公告标题"
            minlength="1"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="noticeData.content"
            type="textarea"
            :rows="5"
            placeholder="请输入公告内容"
            minlength="10"
            maxlength="500"
          ></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="author">
          <el-input
            v-model="noticeData.author"
            placeholder="请输入发布人"
            minlength="1"
            maxlength="20"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="title === '添加公告' ? addNotice() : updateNotice()"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { Edit, Delete, Search, Plus, Refresh } from "@element-plus/icons-vue";
import {
  noticesListService,
  addNoticeService,
  updateNoticeService,
  deleteNoticeService,
  deleteNoticesService,
  queryNoticesService
} from "@/api/notice.js";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 标题
const title = ref("");

// 表格数据
const noticeList = ref([]);
const tableLoading = ref(false);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 查询参数
const noticeQueryData = ref({
  title: "",
  author: "",
  pageNum: 1,
  pageSize: 10
});

// 公告数据
const noticeData = ref({
  id: null,
  title: "",
  content: "",
  author: "",
  createdTime: ""
});

// 表单验证规则
const rules = {
  title: [
    { required: true, message: "公告标题不能为空", trigger: "blur" },
    { min: 1, max: 50, message: "标题长度必须在 1 到 50 个字符之间", trigger: "blur" }
  ],
  content: [
    { required: true, message: "公告内容不能为空", trigger: "blur" },
    { min: 10, max: 500, message: "内容长度必须在 10 到 500 个字符之间", trigger: "blur" }
  ],
  author: [
    { required: true, message: "发布人不能为空", trigger: "blur" },
    { min: 1, max: 20, message: "发布人长度必须在 1 到 20 个字符之间", trigger: "blur" }
  ]
};

// 表单引用
const formRef = ref(null);
const dialogVisible = ref(false);

// 获取公告列表
const getNoticesList = async () => {
  tableLoading.value = true;
  try {
    // 构建查询参数
    const queryParams = {
      ...noticeQueryData.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    };
    
    // 调用查询服务
    const result = await queryNoticesService(queryParams);
    
    if (result.code === 0) {
      noticeList.value = result.data.records || [];
      total.value = result.data.total || 0;
    } else {
      ElMessage.error(result.message || "获取公告列表失败");
    }
  } catch (error) {
    console.error("获取公告列表失败:", error);
    ElMessage.error("获取公告列表失败");
  } finally {
    tableLoading.value = false;
  }
};

// 打开添加公告弹窗
const openAddDialog = () => {
  title.value = "添加公告";
  clearData();
  dialogVisible.value = true;
};

// 清空数据
const clearData = () => {
  noticeData.value = {
    id: null,
    title: "",
    content: "",
    author: ""
  };
};

// 添加公告
const addNotice = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let result = await addNoticeService(noticeData.value);
        if (result.code === 0) {
          ElMessage.success(result.message || "添加成功");
          dialogVisible.value = false;
          await getNoticesList();
        } else {
          ElMessage.error(result.message || "添加失败");
        }
      } catch (error) {
        console.error("添加公告失败:", error);
        ElMessage.error("添加公告失败");
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

// 更新公告
const updateNotice = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let result = await updateNoticeService(noticeData.value);
        if (result.code === 0) {
          ElMessage.success(result.message || "更新成功");
          dialogVisible.value = false;
          await getNoticesList();
        } else {
          ElMessage.error(result.message || "更新失败");
        }
      } catch (error) {
        console.error("更新公告失败:", error);
        ElMessage.error("更新公告失败");
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

// 显示对话框
const showDialog = (row) => {
  title.value = "编辑公告";
  noticeData.value = { ...row };
  dialogVisible.value = true;
};

// 删除公告
const deleteNotice = (row) => {
  ElMessageBox.confirm("您确认要删除该公告吗?", "删除确认", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        let result = await deleteNoticeService(row.id);
        if (result.code === 0) {
          ElMessage.success(result.message || "删除成功");
          await getNoticesList();
        } else {
          ElMessage.error(result.message || "删除失败");
        }
      } catch (error) {
        console.error("删除公告失败:", error);
        ElMessage.error("删除公告失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 批量删除选中的公告
const multipleSelection = ref([]);
const handleSelectionChange = (selection) => {
  multipleSelection.value = selection;
};

const batchDeleteNotices = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请至少选择一条记录");
    return;
  }

  const noticeIds = multipleSelection.value.map((item) => item.id);

  ElMessageBox.confirm(`确认要删除这${noticeIds.length}条记录吗?`, "批量删除确认", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      try {
        let result = await deleteNoticesService(noticeIds);
        if (result.code === 0) {
          ElMessage.success(result.message || "批量删除成功");
          await getNoticesList();
        } else {
          ElMessage.error(result.message || "批量删除失败");
        }
      } catch (error) {
        console.error("批量删除公告失败:", error);
        ElMessage.error("批量删除公告失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  getNoticesList();
};

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getNoticesList();
};

// 查询公告
const handleSearch = () => {
  currentPage.value = 1;
  getNoticesList();
};

// 重置查询条件
const resetSearch = () => {
  noticeQueryData.value = {
    title: "",
    author: "",
    pageNum: 1,
    pageSize: 10
  };
  currentPage.value = 1;
  getNoticesList();
};

// 初始化
getNoticesList();
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