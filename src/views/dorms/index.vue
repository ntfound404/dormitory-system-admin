<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <div class="title-action-row">
          <h2 class="page-title">宿舍楼及寝室管理系统</h2>
        </div>
        <div class="search-section">
          <el-form
            class="search-form"
            ref="queryForm"
            :model="queryData"
            layout="inline"
          >
            <div class="form-row">
              <el-form-item label="宿舍楼">
                <el-input
                  v-model="queryData.building"
                  placeholder="请输入宿舍楼"
                  clearable
                />
              </el-form-item>
              <el-form-item label="性别">
                <el-select
                  class="gender"
                  v-model="queryData.gender"
                  placeholder="请选择性别"
                  clearable
                >
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="寝室号">
                <el-input
                  v-model="queryData.dormNumber"
                  placeholder="请输入寝室号"
                  clearable
                />
              </el-form-item>
              <el-form-item label="楼层">
                <el-input
                  v-model="queryData.floor"
                  placeholder="请输入楼层"
                  clearable
                />
              </el-form-item>
            </div>
          </el-form>
          <div class="button-group">
            <el-button type="success" @click="openAddDormDialog()" :icon="Plus"
              >添加宿舍楼</el-button
            >
            <el-button type="primary" @click="handleSearch()" :icon="Search"
              >查询</el-button
            >
            <el-button @click="resetSearch()" :icon="Refresh">重置</el-button>
          </div>
        </div>
      </div>
    </template>

    <div class="main-content">
      <!-- 树形结构表格 -->
      <el-table
        row-key="id"
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :row-class-name="rowClassName"
        @row-click="onRowClick"
      >
        <el-table-column label="名称" min-width="200">
          <template #default="{ row }">
            <div
              class="name-cell"
              :class="{
                'level-building': row.type === 'building',
                'level-room': row.type === 'room',
                'level-student': row.type === 'student',
              }"
            >
              <span v-if="row.type === 'building'">
                <el-icon class="cell-icon"><School /></el-icon>
                {{ row.name }}
                <el-tag size="small" class="ml-2" type="info">{{
                  row.gender
                }}</el-tag>
              </span>
              <span v-else-if="row.type === 'room'">
                <el-icon class="cell-icon"><House /></el-icon>
                {{ row.dormNumber }}
                <el-tag
                  size="small"
                  :type="
                    row.currentCount >= row.capacity
                      ? 'danger'
                      : row.currentCount >= row.capacity * 0.8
                      ? 'warning'
                      : 'success'
                  "
                  class="ml-2"
                >
                  {{ row.currentCount }}/{{ row.capacity }}
                </el-tag>
              </span>
              <span v-else-if="row.type === 'student'">
                <el-icon class="cell-icon"><User /></el-icon>
                {{ row.name }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="详细信息" min-width="300">
          <template #default="{ row }">
            <div v-if="row.type === 'building'" class="info-container">
              <div class="info-item">
                <span class="info-label">宿舍楼:</span> {{ row.name }}
              </div>
              <div class="info-item">
                <span class="info-label">性别:</span> {{ row.gender }}
              </div>
              <div class="info-item">
                <span class="info-label">更新时间:</span> {{ row.updatedTime }}
              </div>
            </div>
            <div v-else-if="row.type === 'room'" class="info-container">
              <div class="info-item">
                <span class="info-label">寝室号:</span> {{ row.dormNumber }}
              </div>
              <div class="info-item">
                <span class="info-label">楼层:</span> {{ row.floor }}楼
              </div>
              <div class="info-item">
                <span class="info-label">入住人数:</span>
                {{ row.currentCount }}/{{ row.capacity }}
              </div>
              <div class="info-item">
                <span class="info-label">更新时间:</span> {{ row.updatedTime }}
              </div>
            </div>
            <div v-else-if="row.type === 'student'" class="info-container">
              <div class="info-item">
                <span class="info-label">学号:</span> {{ row.studentId }}
              </div>
              <div class="info-item">
                <span class="info-label">班级:</span> {{ row.group }}
              </div>
              <div class="info-item">
                <span class="info-label">性别:</span> {{ row.gender }}
              </div>
              <div class="info-item">
                <span class="info-label">电话:</span> {{ row.phone }}
              </div>
              <div class="info-item">
                <span class="info-label">专业:</span> {{ row.major }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <!-- 编辑按钮 -->
              <el-button
                v-if="row.type === 'building'"
                :icon="Edit"
                circle
                type="primary"
                @click.stop="editDorm(row)"
                size="small"
                title="编辑宿舍楼"
              ></el-button>

              <el-button
                v-if="row.type === 'room'"
                :icon="Edit"
                circle
                type="primary"
                @click.stop="editRoom(row)"
                size="small"
                title="编辑寝室"
              ></el-button>

              <!-- 添加子项按钮 -->
              <el-button
                v-if="row.type === 'building'"
                type="success"
                circle
                :icon="Plus"
                @click.stop="openAddRoomDialog(row)"
                size="small"
                title="添加寝室"
              ></el-button>

              <!-- 删除按钮 -->
              <el-button
                :icon="Delete"
                circle
                type="danger"
                @click.stop="deleteItem(row)"
                size="small"
                :disabled="hasChildren(row)"
                title="删除"
              ></el-button>
            </div>
          </template>
        </el-table-column>
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
    </div>

    <!-- 添加/编辑宿舍楼弹窗 -->
    <el-dialog
      v-model="dormDialogVisible"
      :title="dormTitle"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="dormFormRef"
        :model="dormData"
        :rules="dormRules"
        label-width="100px"
        style="max-height: 60vh; overflow-y: auto"
      >
        <el-form-item label="宿舍楼名称" prop="name">
          <el-input
            v-model="dormData.name"
            placeholder="请输入宿舍楼名称"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="dormData.gender"
            placeholder="请选择性别"
            style="width: 100%"
          >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDorm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加/编辑寝室弹窗 -->
    <el-dialog
      v-model="roomDialogVisible"
      :title="roomTitle"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="roomFormRef"
        :model="roomData"
        :rules="roomRules"
        label-width="100px"
        style="max-height: 60vh; overflow-y: auto"
      >
        <el-form-item label="宿舍楼" prop="dormId">
          <el-input
            v-model="roomData.building"
            minlength="1"
            maxlength="10"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="寝室号" prop="dormNumber">
          <el-input
            v-model="roomData.dormNumber"
            placeholder="请输入寝室号"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input
            v-model="roomData.floor"
            placeholder="请输入楼层"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="最大入住人数" prop="capacity">
          <el-input
            v-model="roomData.capacity"
            placeholder="请输入最大入住人数"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roomDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRoom"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { Edit, Delete, Search, Plus, Refresh } from "@element-plus/icons-vue";
import { School, House, User } from "@element-plus/icons-vue";
import {
  roomsListService,
  getDormInfoService,
  addRoomService,
  updateRoomService,
  deleteRoomService,
  getRoomStudentService,
  queryRoomsService,
} from "@/api/room.js";
import {
  dormListService,
  addDormService,
  updateDormService,
  deleteDormService,
  deleteDormsService,
  queryDormsService,
} from "@/api/dorm.js";
import {
  studentsListService,
  deleteStudentService,
  deleteRoomCountService,
} from "@/api/student.js";
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 表格数据
const tableData = ref([]);
const tableLoading = ref(false);
const dormList = ref([]);
const roomList = ref([]);

// 当前选中项
const selectedDorm = ref(null);
const selectedRoom = ref(null);
const selectedBuildingForAdd = ref(null);
const selectedRoomForAdd = ref(null);

// 对话框控制
const dormDialogVisible = ref(false);
const roomDialogVisible = ref(false);

// 对话框标题
const dormTitle = ref("");
const roomTitle = ref("");

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 查询参数
const queryData = ref({
  building: "",
  gender: "",
  dormNumber: "",
  floor: "",
  pageNum: 1,
  pageSize: 10,
});

// 表单数据
const dormData = ref({
  id: null,
  name: "",
  gender: "",
});

const roomData = ref({
  id: null,
  dormId: "",
  dormNumber: "",
  floor: "",
  capacity: "",
  currentCount: 0,
  building: "",
});

// 表单验证规则
const dormRules = {
  name: [
    { required: true, message: "宿舍楼名称不能为空", trigger: "blur" },
    {
      min: 1,
      max: 10,
      message: "宿舍楼名称长度必须在 1 到 10 个字符之间",
      trigger: "blur",
    },
  ],
  gender: [
    { required: true, message: "请选择宿舍入住性别", trigger: "change" },
  ],
};

const roomRules = {
  dormId: [
    {
      required: true,
      message: "请选择宿舍楼",
      trigger: "change",
    },
  ],
  dormNumber: [
    {
      required: true,
      message: "请输入寝室号",
      trigger: "blur",
    },
    {
      min: 1,
      max: 10,
      message: "寝室号长度必须在 1 到 10 个字符之间",
      trigger: "blur",
    },
  ],
  floor: [
    {
      required: true,
      message: "请输入楼层",
      trigger: "blur",
    },
  ],
  capacity: [
    {
      required: true,
      message: "请输入最大入住人数",
      trigger: "blur",
    },
  ],
};

// 表单引用
const dormFormRef = ref(null);
const roomFormRef = ref(null);

// 检查是否有子节点
const hasChildren = (row) => {
  return row.children && row.children.length > 0;
};

// 行样式类名
const rowClassName = ({ row }) => {
  if (row.type === "building") return "row-building";
  if (row.type === "room") return "row-room";
  if (row.type === "student") return "row-student";
  return "";
};

//获取所有数据并组织成树形结构
const fetchAllData = async () => {
  tableLoading.value = false;
  try {
    //1.获取所有宿舍楼
    const dormResult = await dormListService();
    if (dormResult.code !== 0) {
      ElMessage.error(dormResult.message || "获取宿舍楼数据失败");
      tableLoading.value = false;
      return;
    }

    const buildings = dormResult.data || [];
    dormList.value = buildings;

    //清空缓存的房间列表,重新加载
    roomList.value = [];

    //2.为每个宿舍楼构建树形结构
    const treeStructure = await Promise.all(
      buildings.map(async (dorm) => {
        //获取该宿舍楼的所有寝室
        const roomResult = await queryRoomsService({
          building: dorm.building || dorm.name,
        });
        let rooms = [];

        if (roomResult.code === 0) {
          const roomsData = roomResult.data.records || roomResult.data || [];
          roomList.value = [...roomList.value, ...roomsData];

          //3.为每个寝室获取学生
          rooms = await Promise.all(
            roomsData.map(async (room) => {
              const studentResult = await getRoomStudentService(room.id);
              let students = [];

              if (studentResult.code === 0) {
                students = (studentResult.data || []).map((student) => ({
                  ...student,
                  type: "student",
                  parentId: room.id,
                  id: `student-${student.id}`,
                }));
              }

              return {
                ...room,
                type: "room",
                building: dorm.building || dorm.name,
                id: `room-${room.id}`,
                parentId: `building-${dorm.id}`,
                children: students,
              };
            })
          );
        }

        return {
          ...dorm,
          name: dorm.building || dorm.name,
          type: "building",
          id: `building-${dorm.id}`,
          children: rooms,
        };
      })
    );
    // 应用过滤条件
    tableData.value = filterTreeData(treeStructure);
    total.value = treeStructure.length;
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败");
  } finally {
    tableLoading.value = false;
  }
};

// 根据查询条件过滤树形数据
const filterTreeData = (data) => {
  const { building, gender, dormNumber, floor } = queryData.value;

  if (!building && !gender && !dormNumber && !floor) {
    return data;
  }

  const filteredData = data.filter((dorm) => {
    let match = true;

    // 过滤宿舍楼
    if (building && !dorm.name.includes(building)) {
      match = false;
    }

    if (gender && dorm.gender !== gender) {
      match = false;
    }

    // 如果有寝室号或楼层筛选，需要检查子节点
    if ((dormNumber || floor) && dorm.children && dorm.children.length > 0) {
      const filteredRooms = dorm.children.filter((room) => {
        let roomMatch = true;

        if (dormNumber && !room.dormNumber.includes(dormNumber)) {
          roomMatch = false;
        }

        if (floor && room.floor.toString() !== floor.toString()) {
          roomMatch = false;
        }

        return roomMatch;
      });

      if (filteredRooms.length > 0) {
        dorm.children = filteredRooms;
        match = true;
      } else if (dormNumber || floor) {
        match = false;
      }
    }

    return match;
  });

  return filteredData;
};

// 添加宿舍楼对话框
const openAddDormDialog = () => {
  dormTitle.value = "添加宿舍楼";
  dormData.value = {
    id: null,
    name: "",
    gender: "",
  };
  dormDialogVisible.value = true;
};

// 编辑宿舍楼
const editDorm = (row) => {
  dormTitle.value = "编辑宿舍楼";
  dormData.value = {
    id: row.id.replace("building-", ""),
    name: row.name,
    gender: row.gender,
  };
  dormDialogVisible.value = true;
};

// 提交宿舍楼表单
const submitDorm = async () => {
  dormFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const formData = {
          ...dormData.value,
          building: dormData.value.name, // 确保兼容原有API
        };

        let result;
        if (dormTitle.value === "添加宿舍楼") {
          result = await addDormService(formData);
        } else {
          result = await updateDormService(formData);
        }

        if (result.code === 0) {
          ElMessage.success(
            result.message ||
              (dormTitle.value === "添加宿舍楼" ? "添加成功" : "更新成功")
          );
          dormDialogVisible.value = false;
          await fetchAllData();
        } else {
          ElMessage.error(result.message || "操作失败");
        }
      } catch (error) {
        console.error("操作失败:", error);
        ElMessage.error("操作失败");
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

// 添加寝室对话框
const openAddRoomDialog = (building) => {
  roomTitle.value = "添加寝室";

  // 保存当前选中的宿舍楼，用于自动填充
  selectedBuildingForAdd.value = building;

  roomData.value = {
    id: null,
    building: building ? building.building || building.name : "", // 确保兼容原有API
    dormId: building ? building.id.replace("building-", "") : "",
    dormNumber: "",
    floor: "",
    capacity: "",
    currentCount: 0,
  };
  roomDialogVisible.value = true;
};

// 编辑寝室
const editRoom = (row) => {
  roomTitle.value = "编辑寝室";
  selectedBuildingForAdd.value = null;
  roomData.value = {
    id: row.id.replace("room-", ""),
    building: row.building,
    dormId: row.dormId,
    dormNumber: row.dormNumber,
    floor: row.floor,
    capacity: row.capacity,
    currentCount: row.currentCount || 0,
  };
  roomDialogVisible.value = true;
};

// 提交寝室表单
const submitRoom = async () => {
  roomFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let result;
        if (roomTitle.value === "添加寝室") {
          result = await addRoomService(roomData.value);
        } else {
          result = await updateRoomService(roomData.value);
        }

        if (result.code === 0) {
          ElMessage.success(
            result.message ||
              (roomTitle.value === "添加寝室" ? "添加成功" : "更新成功")
          );
          roomDialogVisible.value = false;
          selectedBuildingForAdd.value = null;
          await fetchAllData();
        } else {
          ElMessage.error(result.message || "操作失败");
        }
      } catch (error) {
        console.error("操作失败:", error);
        ElMessage.error("操作失败");
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

// 删除项目（宿舍楼、寝室或学生）
const deleteItem = async (row) => {
  try {
    let confirmMessage = "";
    let deleteAction = null;

    if (row.type === "building") {
      confirmMessage = `确定要删除宿舍楼 "${row.name}" 吗？`;
      deleteAction = async () => {
        const result = await deleteDormService(row.id.replace("building-", ""));
        return result;
      };
    } else if (row.type === "room") {
      confirmMessage = `确定要删除寝室 "${row.dormNumber}" 吗？`;
      deleteAction = async () => {
        const result = await deleteRoomService(row.id.replace("room-", ""));
        return result;
      };
    } else if (row.type === "student") {
      confirmMessage = `确定要删除学生 "${row.name}" 吗？`;
      deleteAction = async () => {
        await deleteRoomCountService(row.roomId);
        const result = await deleteStudentService(
          row.id.replace("student-", "")
        );
        return result;
      };
    }

    if (!confirmMessage || !deleteAction) {
      return;
    }

    // 确认对话框
    await ElMessageBox.confirm(confirmMessage, "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    // 执行删除
    const result = await deleteAction();
    if (result.code === 0) {
      ElMessage.success(result.message || "删除成功");
      await fetchAllData();
    } else {
      ElMessage.error(result.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

const onRowClick = (row) => {
  console.log(row);
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchAllData();
};

// 重置搜索
const resetSearch = () => {
  queryData.value = {
    building: "",
    gender: "",
    dormNumber: "",
    floor: "",
    pageNum: 1,
    pageSize: 10,
  };
  fetchAllData();
};

// 分页大小改变
const handleSizeChange = (size) => {
  pageSize.value = size;
  queryData.value.pageSize = size;
  fetchAllData();
};

// 页码改变
const handleCurrentChange = (page) => {
  currentPage.value = page;
  queryData.value.pageNum = page;
  fetchAllData();
};

// 初始化加载数据
onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
.page-container {
  padding: 0;
  height: 100%;
}

.header {
  padding: 10px 20px;
}

.title-action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.gender {
  width: 150px;
}

.main-content {
  padding: 0 20px 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-building {
  font-weight: 600;
  color: #303133;
}

.level-room {
  font-weight: 500;
  color: #606266;
  padding-left: 10px;
}

.level-student {
  font-weight: 400;
  color: #606266;
  padding-left: 20px;
}

.cell-icon {
  margin-right: 5px;
}

.ml-2 {
  margin-left: 8px;
}

.info-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.info-item {
  margin-right: 15px;
}

.info-label {
  font-weight: 500;
  margin-right: 5px;
}

/* 树形表格行样式 */
:deep(.row-building) {
  background-color: rgba(240, 240, 245, 0.2);
}

:deep(.row-room) {
  background-color: rgba(240, 240, 245, 0.1);
}

:deep(.row-student) {
  background-color: #ffffff;
}
</style>
