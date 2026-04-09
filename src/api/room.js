import request from '@/utils/request.js'

//查询寝室列表
export const roomsListService = () => {
  return request.get('/admin/room/list');
}

// 通过dormId获取宿舍信息
export const getDormInfoService = (dormId) => {
  // 使用 params 将 dormId 作为查询参数传递
  return request.get('admin/room/dorm', { params: { dormId } });
}

//添加宿舍
export const addRoomService = (roomData) => {
  return request.post('/admin/room/add', roomData, {
    headers: {
      'Content-Type': 'application/json'  // 确保发送的是 JSON 格式的数据
    }
  });
}


//编辑宿舍
export const updateRoomService = (roomData) => {
  return request.post('/admin/room/update',roomData);
}

//删除宿舍
export const deleteRoomService = (id) => {
  return request.post('/admin/room?id=' + id);
}

//多删宿舍
export const deleteRoomsService = (ids) => {
  return request.delete('/admin/room/batch', {
    headers: { 'Content-Type': 'application/json' },  // 确保使用 JSON 格式的请求头
    data: ids  // 将数据放入 `data` 中，这样会被正确识别为请求体
  });
}

//通过roomId查询学生
export const getRoomStudentService = (id) => {
  return request.get('/admin/room/studentList?id=' + id);
}

//动态查询
export const queryRoomsService = (queryRoomData) => {
  return request.post('/admin/room/query',queryRoomData)
}

