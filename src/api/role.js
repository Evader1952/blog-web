import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.role.list,params);
    return result.data;
}

export async function freezeRole(params){
    const result = await axios.post(api.role.freezeRole,params);
    return result.data;
}

export async function roleSelectList(params){
    const result = await axios.post(api.role.roleSelectList,params);
    return result.data;
}

export async function addUser(params){
    const result = await axios.post(api.role.addUser,params);
    return result.data;
}

export async function detail(params){
    const result = await axios.post(api.role.detail,params);
    return result.data;
}

export async function updateDetail(params){
    const result = await axios.post(api.role.updateDetail,params);
    return result.data;
}

export async function queryPwd(params){
    const result = await axios.post(api.role.queryPwd,params);
    return result.data;
}

export async function treeList(params){
    const result = await axios.post(api.role.treeList,params);
    return result.data;
}

export async function addRole(params){
    const result = await axios.post(api.role.addRole,params);
    return result.data;
}

export async function roleDetail(params){
    const result = await axios.post(api.role.roleDetail,params);
    return result.data;
}

export async function updateRole(params){
    const result = await axios.post(api.role.updateRole,params);
    return result.data;
}