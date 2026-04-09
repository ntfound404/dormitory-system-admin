import request from '@/utils/request.js'

//查询宿舍列表
export const dormListService = () => {
  return request.get('/admin/dorm/list');
}

//添加宿舍
export const addDormService = (dormData) => {
  return request.post('/admin/dorm/add', dormData)
}

//修改宿舍信息
export const updateDormService = (dormData) => {
  return request.post('/admin/dorm/update', dormData)
}

//删除宿舍
export const deleteDormService = (id) => {
  return request.post('/admin/dorm?id=' + id)
}

//多删宿舍
export const deleteDormsService = (ids) => {
  return request.delete('/admin/dorm/batch', {
    headers: { 'Content-Type': 'application/json' },  // 确保使用 JSON 格式的请求头
    data: ids  // 将数据放入 `data` 中，这样会被正确识别为请求体
  });
}

//动态查询
export const queryDormsService = (quertDormsData) => {
  return request.post('/admin/dorm/query', quertDormsData)
}