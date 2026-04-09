import request from '@/utils/request.js'

//查询学生列表
export const studentsListService = () => {
  return request.get('/admin/student/list');
}

//添加学生
export const addStudentService = (studentData) => {
  return request.post('/admin/student/add', studentData)
}

//修改学生信息
export const updateStudentService = (studentData) => {
  return request.post('/admin/student/update', studentData)
}

//删除学生
export const deleteStudentService = (id) => {
  return request.post('/admin/student?id=' + id)
}

//多删学生
export const deleteStudentsService = (ids) => {
  return request.delete('/admin/student/batch', {
    headers: { 'Content-Type': 'application/json' },  // 确保使用 JSON 格式的请求头
    data: ids  // 将数据放入 `data` 中，这样会被正确识别为请求体
  });
}

// 通过dormId获取宿舍信息
export const getDormInfoService = (dormId) => {
  // 使用 params 将 dormId 作为查询参数传递
  return request.get('admin/student/dorm', { params: { dormId } });
}

// 通过dormId获取宿舍号
export const getRoomInfoService = (dormId) => {
  // 使用 params 将 dormId 作为查询参数传递
  return request.get('admin/student/room', { params: { dormId } });
}

//分配宿舍人数自增
export const updateRoomCountService = (id) => {
  return request.post('/admin/room/updateCount?id=' + id)
}

//分配宿舍人数自减
export const deleteRoomCountService = (id) => {
  return request.post('/admin/room/deleteCount?id=' + id)
}

//查询为绑定学生用户列表
export const getUnBoundUserListService = () => {
  return request.get('/admin/student/unbound')
}

//绑定学生信息
export const selectStudentUserService = (userId, studentId) => {
  return request.post(`/admin/student/selectStudentUser?userId=${userId}&studentId=${studentId}`);
};

//检查学生是否绑定用户
export const getStudentUserService = (studentId) => {
  return request.post(`/admin/student/checkStudentUser?studentId=${studentId}`)
}

//更新学生绑定用户
export const updateStudentUserService = (userId, studentId) => {
  return request.post(`/admin/student/updateStudentUser?userId=${userId}&studentId=${studentId}`);
};

// 检查用户是否已被绑定到其他学生（排除当前学生）
export function checkUserAlreadyBoundService(userId, currentStudentId = null) {
  return request({
    url: '/admin/student/checkUserBound',
    method: 'get',
    params: {
      userId,
      currentStudentId
    }
  });
}

//动态查询
export const queryStudentService = (studentQueryData) => {
  return request.post('/admin/student/query', studentQueryData)
}




