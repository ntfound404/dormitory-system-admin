import request from '@/utils/request.js'

//查询考勤信息
export const getAttendanceService = () => {
  return request.get('/admin/attendance/list');
}

//通过studentId查询学生信息
export const getStudentInfoService = (studentId) => {
  return request.get('/admin/attendance/studentId', { params: { studentId } })
}

//更新状态
export const updateAttendanceService = (model) => {
  return request.post('/admin/attendance/update', model);
}

//查看状态列表
export const selectLateAttendanceService = (status) => {
  return request.get('/admin/attendance/status', {
    params: { status }
  });
}

//动态查询
export const queryAttendanceService = (attendanceQueryData) => {
  return request.post('/admin/attendance/query', attendanceQueryData)
}