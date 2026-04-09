<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <h2 class="page-title">学生管理系统</h2>
        <div class="search-section">
          <el-form
            class="search-form"
            ref="queryForm"
            :model="studentQueryData"
            layout="inline"
          >
            <div class="form-row">
              <el-form-item label="学号">
                <el-input
                  v-model="studentQueryData.studentId"
                  placeholder="请输入学号"
                  clearable
                />
              </el-form-item>
              <el-form-item label="学生姓名">
                <el-input
                  v-model="studentQueryData.name"
                  placeholder="请输入学生姓名"
                  clearable
                />
              </el-form-item>
              <el-form-item label="班级">
                <el-input
                  v-model="studentQueryData.group"
                  placeholder="请输入班级"
                  clearable
                />
              </el-form-item>
              <el-form-item label="性别">
                <el-select
                  class="gender"
                  v-model="studentQueryData.gender"
                  placeholder="请选择性别"
                  clearable
                >
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="手机号码">
                <el-input
                  v-model="studentQueryData.phone"
                  placeholder="请输入手机号码"
                  clearable
                />
              </el-form-item>
              <el-form-item label="专业">
                <el-input
                  v-model="studentQueryData.major"
                  placeholder="请输入专业"
                  clearable
                />
              </el-form-item>
              <el-form-item label="入学年份">
                <el-input
                  v-model="studentQueryData.enrollmentYear"
                  placeholder="请输入入学年份"
                  clearable
                />
              </el-form-item>
              <el-form-item label="宿舍楼">
                <el-input
                  v-model="studentQueryData.building"
                  placeholder="请输入宿舍楼"
                  clearable
                />
              </el-form-item>
              <el-form-item label="宿舍号">
                <el-input
                  v-model="studentQueryData.dormNumber"
                  placeholder="请输入宿舍号"
                  clearable
                />
              </el-form-item>
            </div>
          </el-form>
          <div class="button-group">
            <el-button type="primary" @click="handleSearch()" :icon="Search"
              >查询</el-button
            >
            <el-button @click="resetSearch()" :icon="Refresh">重置</el-button>
            <el-button type="success" @click="openAddDialog()" :icon="Plus"
              >添加学生</el-button
            >
          </div>
        </div>
      </div>
    </template>

    <el-table
      :data="studentList"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      @selection-change="handleSelectionChange"
      v-loading="tableLoading"
    >
      <el-table-column
        label="序号"
        width="60"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column label="学号" prop="studentId" align="center"></el-table-column>
      <el-table-column label="学生姓名" prop="name" align="center"></el-table-column>
      <el-table-column label="班级" prop="group" align="center">
        <template #default="{ row }">{{ row.group }}班</template>
      </el-table-column>
      <el-table-column
        label="性别"
        width="80"
        prop="gender"
        align="center"
      ></el-table-column>
      <el-table-column
        label="手机号码"
        width="120"
        prop="phone"
        align="center"
      ></el-table-column>
      <el-table-column label="专业" prop="major" align="center"></el-table-column>
      <el-table-column label="宿舍楼" prop="building" align="center"></el-table-column>
      <el-table-column label="宿舍号" prop="dormNumber" align="center"></el-table-column>
      <el-table-column label="入学年份" prop="enrollmentYear" align="center">
        <template #default="{ row }">{{ row.enrollmentYear }}年</template>
      </el-table-column>
      <el-table-column label="绑定用户" prop="username" align="center"></el-table-column>
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
            @click="deleteStudent(row)"
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

    <!-- 添加/编辑学生弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="500px" destroy-on-close>
      <el-form
        ref="formRef"
        :model="studentData"
        :rules="rules"
        label-width="100px"
        style="max-height: 60vh; overflow-y: auto"
      >
        <el-form-item label="学号" prop="studentId">
          <el-input
            v-model="studentData.studentId"
            minlength="1"
            maxlength="10"
            placeholder="请输入学号"
          ></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" prop="name">
          <el-input
            v-model="studentData.name"
            minlength="1"
            maxlength="15"
            placeholder="请输入学生姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="studentData.gender"
            @change="handleGenderChange"
            placeholder="请选择性别"
            style="width: 100%"
          >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="studentData.phone"
            minlength="1"
            maxlength="15"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="group">
          <el-input
            v-model="studentData.group"
            minlength="1"
            maxlength="15"
            placeholder="请输入班级"
          ></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input
            v-model="studentData.major"
            minlength="1"
            maxlength="15"
            placeholder="请输入专业"
          ></el-input>
        </el-form-item>
        <el-form-item label="宿舍楼" prop="building">
          <el-select
            v-model="studentData.building"
            @change="handleDormChange"
            placeholder="请选择宿舍楼"
            style="width: 100%"
          >
            <el-option
              v-for="item in dormList"
              :key="item.value"
              :label="item.building"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="宿舍号" prop="roomId">
          <el-select
            v-model="studentData.roomId"
            @change="handleRoomChange"
            placeholder="请选择宿舍号"
            style="width: 100%"
          >
            <el-option
              v-for="item in roomList"
              :key="item.id"
              :label="item.dormNumber"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入学年份" prop="enrollmentYear">
          <el-input
            v-model="studentData.enrollmentYear"
            minlength="1"
            maxlength="15"
            placeholder="请输入入学年份"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="title === '编辑学生'" label="绑定用户" prop="userId">
          <el-select
            v-model="studentData.username"
            @change="handleUserSelect"
            placeholder="请选择用户"
            filterable
            clearable
            style="width: 100%"
          >
            <!-- 添加当前绑定的用户（如果有） -->
            <el-option
              v-if="studentData.username && studentData.username !== '未绑定用户'"
              :key="studentData.userId"
              :label="studentData.username"
              :value="studentData.username"
            />
            <!-- 未绑定用户选项 - 始终显示 -->
            <el-option key="unbound" label="未绑定用户" value="未绑定用户" />
            <!-- 其他未绑定的用户列表 -->
            <el-option
              v-for="item in unBoundUserList"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="title === '添加学生' ? addStudent() : updateStudent()"
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
  studentsListService,
  addStudentService,
  updateStudentService,
  deleteStudentService,
  deleteStudentsService,
  getDormInfoService,
  getRoomInfoService,
  updateRoomCountService,
  deleteRoomCountService,
  getUnBoundUserListService,
  selectStudentUserService,
  getStudentUserService,
  updateStudentUserService,
  checkUserAlreadyBoundService,
  queryStudentService,
} from "@/api/student.js";
import { dormListService } from "@/api/dorm.js";
import { roomsListService } from "@/api/room.js";
import { userListService } from "@/api/user.js";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 标题
const title = ref("");

// 表格数据
const studentList = ref([]);
const dormList = ref([]);
const roomList = ref([]);
const unBoundUserList = ref([]);
const selectedUserId = ref(null);
const tableLoading = ref(false);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 查询参数
const studentQueryData = ref({
  studentId: "",
  name: "",
  gender: "",
  group: "",
  phone: "",
  major: "",
  building: "",
  dormNumber: "",
  enrollmentYear: "",
  pageNum: 1,
  pageSize: 10,
});

// 学生表单数据
const studentData = ref({
  studentId: "",
  name: "",
  gender: "",
  phone: "",
  major: "",
  dormId: null,
  group: "",
  roomId: null,
  dormNumber: null,
  enrollmentYear: "",
  id: null,
  userId: null,
  username: "未绑定用户",
  hadBindUser: false,
  building: "",
});

// 表单验证规则
const rules = {
  studentId: [
    { required: true, message: "学号不能为空", trigger: "blur" },
    { min: 1, max: 10, message: "学号长度必须在 1 到 10 个字符之间", trigger: "blur" },
    { pattern: /^[0-9]{1,10}$/, message: "学号必须为数字", trigger: "blur" },
  ],
  name: [
    { required: true, message: "学生姓名不能为空", trigger: "blur" },
    {
      min: 1,
      max: 15,
      message: "学生姓名长度必须在 1 到 15 个字符之间",
      trigger: "blur",
    },
    {
      pattern: /^[\u4e00-\u9fa5]{1,15}$/,
      message: "学生姓名只能包含中文字符",
      trigger: "blur",
    },
  ],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  phone: [
    { required: true, message: "手机号码不能为空", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码", trigger: "blur" },
  ],
  group: [{ required: true, message: "班级不能为空", trigger: "blur" }],
  major: [
    { required: true, message: "专业不能为空", trigger: "blur" },
    { min: 1, max: 20, message: "专业长度必须在 1 到 20 个字符之间", trigger: "blur" },
  ],
  building: [{ required: true, message: "请选择宿舍楼", trigger: "blur" }],
  roomId: [{ required: true, message: "请选择宿舍号", trigger: "blur" }],
  enrollmentYear: [
    { required: true, message: "入学年份不能为空", trigger: "blur" },
    { pattern: /^\d{4}$/, message: "入学年份必须是 4 位数字", trigger: "blur" },
  ],
};

// 表单引用
const formRef = ref(null);
const dialogVisible = ref(false);

// 初始化数据
const initializeData = async () => {
  await getDormsList();
  await getRoomsList();
  await getStudentsList();
};

// 查询未绑定学生用户列表
const getUnBoundUserList = async () => {
  try {
    let result = await getUnBoundUserListService();
    unBoundUserList.value = result.data;
  } catch (error) {
    console.error("获取未绑定用户列表失败:", error);
    ElMessage.error("获取未绑定用户列表失败");
  }
};

// 获取宿舍楼列表
const getDormsList = async () => {
  try {
    let result = await dormListService();
    dormList.value = result.data;
  } catch (error) {
    console.error("获取宿舍楼列表失败:", error);
    ElMessage.error("获取宿舍楼列表失败");
  }
};

// 获取宿舍列表
const getRoomsList = async () => {
  try {
    let result = await roomsListService();
    roomList.value = result.data;
  } catch (error) {
    console.error("获取宿舍列表失败:", error);
    ElMessage.error("获取宿舍列表失败");
  }
};

// 获取学生列表
const getStudentsList = async () => {
  tableLoading.value = true;
  try {
    // 构建分页查询参数
    const queryParams = {
      ...studentQueryData.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    };

    let result = await queryStudentService(queryParams);
    

    // 更新分页信息和总条数
    total.value = result.data.total || 0;

    // 获取原始学生数据
    const rawStudentList = result.data.records || [];

    // 补充关联数据（宿舍楼、宿舍号、用户信息）
    const enrichedStudentList = await Promise.all(
      rawStudentList.map(async (student) => {
        // 获取宿舍楼信息
        let building = "未知";
        if (student.dormId) {
          try {
            const dormData = await getDormInfoService(student.dormId);
            if (dormData.data && dormData.data.length > 0) {
              building = dormData.data[0].building || "未知";
            }
          } catch (error) {
            console.error(`获取学生 ${student.id} 宿舍楼信息失败:`, error);
          }
        }

        // 获取宿舍号信息
        let dormNumber = "未知";
        if (student.roomId) {
          try {
            const roomData = await getRoomInfoService(student.roomId);
            if (roomData.data && roomData.data.length > 0) {
              dormNumber = roomData.data[0].dormNumber || "未知";
            }
          } catch (error) {
            console.error(`获取学生 ${student.id} 宿舍号信息失败:`, error);
          }
        }

        // 获取用户信息
        let username = "未绑定用户";
        let userId = null;
        let hadBindUser = false;
        try {
          const userData = await getStudentUserService(student.id);
          if (
            userData.data &&
            userData.data.length > 0 &&
            userData.data[0].username !== "未绑定用户"
          ) {
            username = userData.data[0].username;
            userId = userData.data[0].id;
            hadBindUser = true;
          }
        } catch (error) {
          console.error(`获取学生 ${student.id} 用户信息失败:`, error);
        }

        // 合并所有信息
        return {
          ...student,
          building,
          dormNumber,
          username,
          userId,
          hadBindUser,
        };
      })
    );

    studentList.value = enrichedStudentList;
  } catch (error) {
    console.error("获取学生列表失败:", error);
    ElMessage.error("获取学生列表失败");
  } finally {
    tableLoading.value = false;
  }
};

// 清空学生数据
const clearData = () => {
  studentData.value = {
    studentId: "",
    name: "",
    gender: "",
    phone: "",
    major: "",
    dormId: null,
    building: "",
    group: "",
    roomId: null,
    dormNumber: null,
    enrollmentYear: "",
    id: null,
    userId: null,
    username: "未绑定用户",
    hadBindUser: false,
  };
  selectedUserId.value = null;
};

// 打开添加学生弹窗
const openAddDialog = async () => {
  title.value = "添加学生";
  clearData();
  await getUnBoundUserList();
  dialogVisible.value = true;
};

// 处理性别变化
const handleGenderChange = async () => {
  await getDormsList();
  if (studentData.value.gender === "男") {
    dormList.value = dormList.value.filter((dorm) => dorm.gender === "男");
  } else {
    dormList.value = dormList.value.filter((dorm) => dorm.gender === "女");
  }
  // 重置宿舍楼和宿舍号选择
  studentData.value.building = null;
  studentData.value.dormId = null;
  studentData.value.roomId = null;
};

// 处理宿舍楼变化
const handleDormChange = async () => {
  const selectedDormId = studentData.value.building;
  studentData.value.dormId = selectedDormId;

  if (!selectedDormId) {
    roomList.value = [];
    studentData.value.roomId = null;
    return;
  }

  await getRoomsList();
  roomList.value = roomList.value.filter((room) => room.dormId == selectedDormId);
  studentData.value.roomId = null;
};

// 处理宿舍号变化
const handleRoomChange = async () => {
  const selectedRoomId = studentData.value.roomId;

  if (!selectedRoomId) {
    studentData.value.dormNumber = null;
    return;
  }

  const selectedRoom = roomList.value.find((room) => room.id === selectedRoomId);
  if (selectedRoom) {
    studentData.value.dormNumber = selectedRoom.dormNumber;
  }
};

// 处理用户选择
const handleUserSelect = (username) => {
  if (username === "未绑定用户") {
    studentData.value.userId = null;
    selectedUserId.value = null;
  } else {
    const selectedUser = unBoundUserList.value.find((user) => user.username === username);
    if (selectedUser) {
      studentData.value.userId = selectedUser.id;
      selectedUserId.value = selectedUser.id;
    }
  }
};

// 打开编辑学生弹窗
const showDialog = async (row) => {
  console.log(row);
  
  if (!row || !row.id) {
    console.error("编辑学生需要有效的学生ID");
    return;
  }

  title.value = "编辑学生";
  clearData(); // 先清空数据
  await getUnBoundUserList();

  // 获取用户信息
  const userInfoResult = await getStudentUserService(row.id);
  const userList = userInfoResult.data || [];

  if (userList.length > 0 && userList[0].username !== "未绑定用户") {
    row.userId = userList[0].id;
    row.username = userList[0].username;
    row.hadBindUser = true;
    selectedUserId.value = userList[0].id;

    const userExists = unBoundUserList.value.some((user) => user.id === userList[0].id);
    if (!userExists && userList[0].id) {
      unBoundUserList.value.push({
        id: userList[0].id,
        username: userList[0].username,
      });
    }
  } else {
    row.userId = null;
    row.username = "未绑定用户";
    row.hadBindUser = false;
    selectedUserId.value = null;
  }

  // 复制行数据到studentData
  studentData.value = { ...row };

  // 根据性别加载宿舍楼列表
  await handleGenderChange();
  
  // 如果有宿舍楼ID，设置宿舍楼选择
  if (row.dormId) {
    studentData.value.building = row.dormId;
  }
  
  // 根据宿舍楼加载宿舍号列表
  await handleDormChange();
  
  // 如果有宿舍号ID，设置宿舍号选择
  if (row.roomId) {
    studentData.value.roomId = row.roomId;
  }

  // 打开对话框
  dialogVisible.value = true;
};

// 检查用户是否已绑定学生
const checkUserAlreadyBound = async (userId, currentStudentId = null) => {
  if (!userId) return false;
  const result = await checkUserAlreadyBoundService(userId, currentStudentId);
  return result.data;
};

// 添加学生
const addStudent = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 检查用户绑定
      if (studentData.value.username !== "未绑定用户") {
        const selectedUser = unBoundUserList.value.find(
          (user) => user.username === studentData.value.username
        );

        if (selectedUser) {
          const isUserBound = await checkUserAlreadyBound(selectedUser.id);
          if (isUserBound) {
            ElMessage.error("该用户已绑定其他学生，一个用户只能绑定一个学生");
            return;
          }
        }
      }

      // 更新宿舍人数
      try {
        const updateResult = await updateRoomCountService(studentData.value.roomId);
        if (updateResult.code !== 0) {
          ElMessage.error(updateResult.message || "更新寝室人数失败");
          return;
        }
      } catch (error) {
        console.error("更新寝室人数失败:", error);
        ElMessage.error("更新寝室人数失败");
        return;
      }

      // 添加学生
      try {
        const result = await addStudentService({
          ...studentData.value,
          dormId: studentData.value.dormId,
        });

        if (result.code === 0) {
          let studentId = null;
          if (result.data) {
            studentId = typeof result.data === "object" ? result.data.id : result.data;
          }

          // 如果选择了用户，绑定用户
          if (studentId && studentData.value.username !== "未绑定用户") {
            const selectedUser = unBoundUserList.value.find(
              (user) => user.username === studentData.value.username
            );
            if (selectedUser) {
              const bindResult = await selectStudentUserService(
                selectedUser.id,
                studentId
              );
              if (bindResult.code !== 0) {
                ElMessage.warning(bindResult.message || "用户绑定失败，但学生信息已保存");
              }
            }
          }

          ElMessage.success(result.message ? result.message : "添加成功");
          dialogVisible.value = false;
          await getStudentsList();
        } else {
          ElMessage.error(result.message ? result.message : "添加失败");
        }
      } catch (error) {
        console.error("添加学生失败:", error);
        ElMessage.error("添加学生失败");
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

// 更新学生
const updateStudent = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 检查用户绑定
      if (studentData.value.username !== "未绑定用户") {
        const selectedUser = unBoundUserList.value.find(
          (user) => user.username === studentData.value.username
        );

        if (selectedUser) {
          const isUserBound = await checkUserAlreadyBound(
            selectedUser.id,
            studentData.value.id
          );
          if (isUserBound) {
            ElMessage.error("该用户已绑定其他学生，一个用户只能绑定一个学生");
            return;
          }
          studentData.value.userId = selectedUser.id;
        }
      }

      // 更新学生信息
      try {
        let result = await updateStudentService(studentData.value);

        if (result.code === 0) {
          // 处理用户绑定
          if (studentData.value.username === "未绑定用户") {
            await updateStudentUserService(null, studentData.value.id);
          } else {
            const selectedUser = unBoundUserList.value.find(
              (user) => user.username === studentData.value.username
            );

            if (selectedUser) {
              let bindResult;
              if (studentData.value.hadBindUser) {
                bindResult = await updateStudentUserService(
                  selectedUser.id,
                  studentData.value.id
                );
              } else {
                bindResult = await selectStudentUserService(
                  selectedUser.id,
                  studentData.value.id
                );
              }

              if (bindResult.code !== 0) {
                ElMessage.warning(bindResult.message || "用户绑定失败，但学生信息已更新");
              }
            }
          }

          ElMessage.success(result.message ? result.message : "更新成功");
          dialogVisible.value = false;
          await getStudentsList();
        } else {
          ElMessage.error(result.message ? result.message : "更新失败");
        }
      } catch (error) {
        console.error("更新学生失败:", error);
        ElMessage.error("更新学生失败");
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

// 删除学生
const deleteStudent = (row) => {
  ElMessageBox.confirm("您确认要删除该学生吗?", "删除确认", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        // 更新宿舍人数
        if (row.roomId) {
          await deleteRoomCountService(row.roomId);
        }

        // 删除学生
        let result = await deleteStudentService(row.id);

        if (result.code === 0) {
          ElMessage.success(result.message ? result.message : "删除成功");
          getStudentsList();
        } else {
          ElMessage.error(result.message ? result.message : "删除失败");
        }
      } catch (error) {
        console.error("删除学生失败:", error);
        ElMessage.error("删除学生失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 批量删除选中的学生
const multipleSelection = ref([]);
const handleSelectionChange = (selection) => {
  multipleSelection.value = selection;
};

const batchDeleteStudents = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请至少选择一条记录");
    return;
  }

  const studentIds = multipleSelection.value.map((item) => item.id);

  ElMessageBox.confirm(`确认要删除这${studentIds.length}条记录吗?`, "批量删除确认", {
    confirmButtonText: "确认删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        // 更新宿舍人数
        for (const student of multipleSelection.value) {
          if (student.roomId) {
            await deleteRoomCountService(student.roomId);
          }
        }

        // 批量删除学生
        let result = await deleteStudentsService(studentIds);

        if (result.code === 0) {
          ElMessage.success(result.message ? result.message : "批量删除成功");
          getStudentsList();
        } else {
          ElMessage.error(result.message ? result.message : "批量删除失败");
        }
      } catch (error) {
        console.error("批量删除学生失败:", error);
        ElMessage.error("批量删除学生失败");
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
  getStudentsList();
};

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getStudentsList();
};

// 查询学生
const handleSearch = () => {
  currentPage.value = 1;
  getStudentsList();
};

// 重置查询条件
const resetSearch = () => {
  studentQueryData.value = {
    studentId: "",
    name: "",
    gender: "",
    group: "",
    phone: "",
    major: "",
    building: "",
    dormNumber: "",
    enrollmentYear: "",
    pageNum: 1,
    pageSize: 10,
  };
  currentPage.value = 1;
  getStudentsList();
};

// 初始化
initializeData();
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

.gender{
  width: 140px;
}
</style>
