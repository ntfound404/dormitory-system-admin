<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <h2 class="page-title">考勤管理系统</h2>
        <div class="search-section">
          <el-form
            class="search-form"
            ref="queryForm"
            :model="attendanceQueryData"
            layout="inline"
          >
            <div class="form-row">
              <el-form-item label="学号">
                <el-input
                  v-model="attendanceQueryData.studentId"
                  placeholder="请输入学号"
                  clearable
                />
              </el-form-item>
              <el-form-item label="学生姓名">
                <el-input
                  v-model="attendanceQueryData.name"
                  placeholder="请输入学生姓名"
                  clearable
                />
              </el-form-item>
              <el-form-item label="班级">
                <el-input
                  v-model="attendanceQueryData.group"
                  placeholder="请输入班级"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态">
                <el-select
                  class="status-select"
                  v-model="attendanceQueryData.status"
                  placeholder="请选择状态"
                  clearable
                >
                  <el-option label="正常" value="正常"></el-option>
                  <el-option label="晚归" value="晚归"></el-option>
                  <el-option label="未归" value="未归"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="寝室号">
                <el-input
                  v-model="attendanceQueryData.dormNumber"
                  placeholder="请输入寝室号"
                  clearable
                />
              </el-form-item>
              <el-form-item label="日期">
                <el-date-picker
                  v-model="attendanceQueryData.date"
                  type="date"
                  placeholder="选择日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </div>
          </el-form>
          <div class="button-group">
            <el-button type="primary" @click="handleSearch()" :icon="Search"
              >查询</el-button
            >
            <el-button @click="resetSearch()" :icon="Refresh">重置</el-button>
            <el-button type="warning" @click="selectLate()" :icon="Warning"
              >晚归查询</el-button
            >
            <el-button type="danger" @click="selectAbsent()" :icon="CircleClose"
              >未归查询</el-button
            >
          </div>
        </div>
      </div>
    </template>

    <el-table
      :data="attendanceList"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      v-loading="tableLoading"
    >
      <el-table-column
        label="序号"
        width="60"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column label="学号" prop="studentId" align="center"></el-table-column>
      <el-table-column label="姓名" prop="name" align="center"></el-table-column>
      <el-table-column label="班级" prop="group" align="center">
        <template #default="{ row }">{{ row.group }}班</template>
      </el-table-column>
      <el-table-column label="寝室号" prop="dormNumber" align="center"></el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remarks" align="center"></el-table-column>
      <el-table-column label="日期" prop="date" align="center"></el-table-column>
      <el-table-column label="操作" width="100" fixed="right" align="center">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            type="primary"
            @click="showDialog(row)"
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

    <!-- 备注编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="考勤信息编辑"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-width="100px"
        style="max-height: 60vh; overflow-y: auto"
      >
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="model.studentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="model.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="group">
          <el-input v-model="model.group" disabled></el-input>
        </el-form-item>
        <el-form-item label="寝室号" prop="dormNumber">
          <el-input v-model="model.dormNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="model.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="正常" value="正常"></el-option>
            <el-option label="晚归" value="晚归"></el-option>
            <el-option label="未归" value="未归"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            v-model="model.remarks"
            placeholder="请输入备注信息"
            rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-input v-model="model.date" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { Edit, Search, Refresh, Warning, CircleClose } from "@element-plus/icons-vue";
import {
  getAttendanceService,
  getStudentInfoService,
  updateAttendanceService,
  selectLateAttendanceService,
  queryAttendanceService,
} from "@/api/attendance.js";
import { getRoomInfoService } from "@/api/student.js";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

// 查询参数
const attendanceQueryData = ref({
  studentId: "",
  name: "",
  group: "",
  dormNumber: "",
  status: "",
  date: "",
  pageNum: 1,
  pageSize: 10,
});

// 表格数据
const attendanceList = ref([]);
const tableLoading = ref(false);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 弹窗相关
const dialogVisible = ref(false);
const formRef = ref(null);

// 表单数据
const model = ref({
  id: null,
  studentId: "",
  name: "",
  group: "",
  dormNumber: "",
  status: "",
  remarks: "",
  date: "",
});

// 验证规则
const rules = {
  status: [{ required: true, message: "请选择考勤状态", trigger: "change" }],
};

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case "正常":
      return "success";
    case "晚归":
      return "warning";
    case "未归":
      return "danger";
    default:
      return "info";
  }
};

// 打开编辑弹窗
const showDialog = (row) => {
  model.value = { ...row };
  dialogVisible.value = true;
};

// 确认更新
const confirm = async () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const payload = {
          id: model.value.id,
          status: model.value.status,
          remarks: model.value.remarks,
        };

        let result = await updateAttendanceService(payload);

        if (result.code === 0) {
          ElMessage.success(result.message || "更新成功");
          dialogVisible.value = false;
          getAttendanceList();
        } else {
          ElMessage.error(result.message || "更新失败");
        }
      } catch (error) {
        console.error("更新考勤状态失败:", error);
        ElMessage.error("更新考勤状态失败");
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

// 获取考勤列表
const getAttendanceList = async () => {
  tableLoading.value = true;
  try {
    // 构建分页查询参数
    const queryParams = {
      ...attendanceQueryData.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    };

    let result = await queryAttendanceService(queryParams)

    // 更新分页信息和总条数
    total.value = result.data.total || 0;

    // 获取考勤数据
    const rawAttendanceList = result.data.records || [];

    // 补充关联数据（学生信息、寝室号）
    const enrichedAttendanceList = await Promise.all(
      rawAttendanceList.map(async (attendance) => {
        try {
          const studentData = await getStudentInfoService(attendance.studentId);
          if (!studentData.data || studentData.data.length === 0) {
            return {
              ...attendance,
              name: "未知",
              group: "未知",
              dormNumber: "未知",
            };
          }

          const student = studentData.data[0];
          let dormNumber = "未知";

          if (student.roomId) {
            try {
              const roomData = await getRoomInfoService(student.roomId);
              if (roomData.data && roomData.data.length > 0) {
                dormNumber = roomData.data[0].dormNumber;
              }
            } catch (error) {
              console.error(`获取寝室号信息失败:`, error);
            }
          }

          return {
            ...attendance,
            studentId: student.studentId,
            name: student.name,
            group: student.group,
            dormNumber: dormNumber,
          };
        } catch (error) {
          console.error("获取学生信息失败:", error);
          return {
            ...attendance,
            name: "未知",
            group: "未知",
            dormNumber: "未知",
          };
        }
      })
    );

    attendanceList.value = enrichedAttendanceList;
  } catch (error) {
    console.error("获取考勤列表失败:", error);
    ElMessage.error("获取考勤列表失败");
  } finally {
    tableLoading.value = false;
  }
};

// 处理页面大小变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  getAttendanceList();
};

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getAttendanceList();
};

// 查询考勤
const handleSearch = () => {
  currentPage.value = 1;
  getAttendanceList();
};

// 重置查询条件
const resetSearch = () => {
  attendanceQueryData.value = {
    studentId: "",
    name: "",
    group: "",
    dormNumber: "",
    status: "",
    date: "",
    pageNum: 1,
    pageSize: 10,
  };
  currentPage.value = 1;
  getAttendanceList();
};

// 搜索晚归列表
const selectLate = async () => {
  tableLoading.value = true;
  try {
    attendanceQueryData.value.status = "晚归";
    let result = await selectLateAttendanceService("晚归");

    // 更新分页信息和总条数
    total.value = result.data.length || 0;

    // 获取考勤数据
    const rawAttendanceList = result.data || [];

    // 补充关联数据（学生信息、寝室号）
    const enrichedAttendanceList = await Promise.all(
      rawAttendanceList.map(async (attendance) => {
        try {
          const studentData = await getStudentInfoService(attendance.studentId);
          if (!studentData.data || studentData.data.length === 0) {
            return {
              ...attendance,
              name: "未知",
              group: "未知",
              dormNumber: "未知",
            };
          }

          const student = studentData.data[0];
          let dormNumber = "未知";

          if (student.roomId) {
            try {
              const roomData = await getRoomInfoService(student.roomId);
              if (roomData.data && roomData.data.length > 0) {
                dormNumber = roomData.data[0].dormNumber;
              }
            } catch (error) {
              console.error(`获取寝室号信息失败:`, error);
            }
          }

          return {
            ...attendance,
            studentId: student.studentId,
            name: student.name,
            group: student.group,
            dormNumber: dormNumber,
          };
        } catch (error) {
          console.error("获取学生信息失败:", error);
          return {
            ...attendance,
            name: "未知",
            group: "未知",
            dormNumber: "未知",
          };
        }
      })
    );

    attendanceList.value = enrichedAttendanceList;
  } catch (error) {
    console.error("获取晚归列表失败:", error);
    ElMessage.error("获取晚归列表失败");
  } finally {
    tableLoading.value = false;
  }
};

// 搜索未归列表
const selectAbsent = async () => {
  tableLoading.value = true;
  try {
    attendanceQueryData.value.status = "未归";
    let result = await selectLateAttendanceService("未归");

    // 更新分页信息和总条数
    total.value = result.data.length || 0;

    // 获取考勤数据
    const rawAttendanceList = result.data || [];

    // 补充关联数据（学生信息、寝室号）
    const enrichedAttendanceList = await Promise.all(
      rawAttendanceList.map(async (attendance) => {
        try {
          const studentData = await getStudentInfoService(attendance.studentId);
          if (!studentData.data || studentData.data.length === 0) {
            return {
              ...attendance,
              name: "未知",
              group: "未知",
              dormNumber: "未知",
            };
          }

          const student = studentData.data[0];
          let dormNumber = "未知";

          if (student.roomId) {
            try {
              const roomData = await getRoomInfoService(student.roomId);
              if (roomData.data && roomData.data.length > 0) {
                dormNumber = roomData.data[0].dormNumber;
              }
            } catch (error) {
              console.error(`获取寝室号信息失败:`, error);
            }
          }

          return {
            ...attendance,
            studentId: student.studentId,
            name: student.name,
            group: student.group,
            dormNumber: dormNumber,
          };
        } catch (error) {
          console.error("获取学生信息失败:", error);
          return {
            ...attendance,
            name: "未知",
            group: "未知",
            dormNumber: "未知",
          };
        }
      })
    );

    attendanceList.value = enrichedAttendanceList;
  } catch (error) {
    console.error("获取未归列表失败:", error);
    ElMessage.error("获取未归列表失败");
  } finally {
    tableLoading.value = false;
  }
};

// 初始化数据
getAttendanceList();
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

.status-select {
  width: 140px;
}
</style>
