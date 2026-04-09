import request from '@/utils/request.js'

//查询公告列表
export const noticesListService = () => {
  return request.get('/admin/notices/list');
}

//添加公告
export const addNoticeService = (noticeData) => {
  return request.post('/admin/notices/add', noticeData, {
    headers: {
      'Content-Type': 'application/json'  // 确保发送的是 JSON 格式的数据
    }
  });
}


//编辑公告
export const updateNoticeService = (noticeData) => {
  return request.post('/admin/notices/update', noticeData);
}

//删除公告
export const deleteNoticeService = (id) => {
  return request.post('/admin/notices?id=' + id);
}

//多删公告
export const deleteNoticesService = (ids) => {
  return request.delete('/admin/notices/batch', {
    headers: { 'Content-Type': 'application/json' },  // 确保使用 JSON 格式的请求头
    data: ids  // 将数据放入 `data` 中，这样会被正确识别为请求体
  });
}

//动态查询
export const queryNoticesService = (queryNoticesData) => {
  return request.post('/admin/notices/query', queryNoticesData)
}


