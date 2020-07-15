import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.packet.list,params);
    return result.data;
}

export async function packetExport(params){
    const result = await axios.post(api.packet.batchExport,params);
    return result.data;
}

export async function configlist(params){
    const result = await axios.post(api.packet.configlist,params);
    return result.data;
}

export async function shiftAdd(params) {
    const result = await axios.post(api.packet.configAdd, params)
    return result.data
}

export async function findConfigById(params) {
    const result = await axios.post(api.packet.findConfigById,params)
    return result.data
}

export async function updateConfig(params) {
    const result = await axios.post(api.packet.updateConfig,params)
    return result.data
}

export async function deleteConfig(params){
    const result = await axios.post(api.packet.deleteConfig,params);
    return result.data;
}

export async function getAreaList(params){
    const result = await axios.post(api.packet.getAreaList,params);
    return result.data;
}

export async function onChangeState(params) {
    const result = await axios.post(api.packet.changeState, params)
    return result.data
}
export async function registerList(params) {
    const result = await axios.post(api.packet.registerList, params)
    return result.data
}
export async function closeAccount(params) {
    const result = await axios.post(api.packet.closeAccount, params)
    return result.data
}
export async function detail(params) {
    const result = await axios.post(api.packet.detail, params)
    return result.data
}
export async function updateRegister(params) {
    const result = await axios.post(api.packet.updateRegister, params)
    return result.data
}
export async function getChangeLog(params) {
    const result = await axios.post(api.packet.getChangeLog, params)
    return result.data
}