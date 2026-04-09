//导入request.js请求工具
import request from '@/utils/request.js'
//提供调用注册接口的函数
export const userRegisterService = (registerData) => {
    //借助于UrlSearchParams完成传递
    const params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, registerData[key]);
    }
    return request.post('/user/register', params);
}

//提供调用登录接口的函数
export const userLoginService = (loginData) => {
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    return request.post('/user/login', params)
}


//获取用户详细信息
export const userInfoService = () => {
    return request.get('/user/userInfo')
}


//修改个人信息
export const userInfoUpdateService = (userInfoData) => {
    return request.put('/user/update', userInfoData)
}

// 修改用户密码
export const userResetPasswordService = (oldPwd, newPwd, rePwd) => {
    return request.patch('/user/updatePwd',
        {
            old_pwd: oldPwd,
            new_pwd: newPwd,
            re_pwd: rePwd
        },
    );
}

//查询用户列表
export const userListService = () => {
    return request.get('/user/list')
}

//添加用户（超级管理员权限）
export const addUserService = (userModel) => {
    //借助于UrlSearchParams完成传递
    const params = new URLSearchParams()
    for (let key in userModel) {
        params.append(key, userModel[key]);
    }
    return request.post('/super-admin/user-role/add', params);
}

//更改用户权限（超级管理员权限）
export const userRoleService = (params) => {
    return request.post('/super-admin/user-role/updateRole', null, {
        params: {
            userId: params.userId,
            roleId: params.roleId
        }
    });
}


//更改用户信息（超级管理员权限）
export const userUpdateService = (userInfoData) => {
    return request.put('/super-admin/user-role/update', userInfoData)
}

// 删除用户（超级管理员权限）
export const deleteUserService = (id) => {
    return request.delete('/super-admin/user-role?id=' + id)
}

//更改用户信息（管理员权限）
export const adminUpdateService = (userInfoData) => {
    return request.put('/admin/user-role/update', userInfoData)
}


//动态查询
export const queryUsersService = (userQueryData) => {
    return request.post('/user/query',userQueryData)
}

