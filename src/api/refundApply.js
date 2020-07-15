import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.refundApply.list,params);
    return result.data;
}

export async function batchExport(params){
    const result = await axios.post(api.refundApply.batchExport,params);
    return result.data;
}
export async function refundApply(params){
    const result = await axios.post(api.refundApply.refundApply,params);
    return result.data;
}
export async function refundByAuto(params){
    const result = await axios.post(api.refundApply.refundByAuto,params);
    return result.data;
}
export async function refundByPerson(params){
    const result = await axios.post(api.refundApply.refundByPerson,params);
    return result.data;
}
export async function update(params){
    const result = await axios.post(api.refundApply.update,params);
    return result.data;
}
export async function urgent(params){
    const result = await axios.post(api.refundApply.urgent,params);
    return result.data;
}
export async function selectRefundCount(params){
    const result = await axios.post(api.refundApply.selectRefundCount,params);
    return result.data;
}
export async function detail(params){
    const result = await axios.post(api.refundApply.detail,params);
    return result.data;
}
export async function fileDownLoad(params){
    const result = await axios.post(api.refundApply.fileDownLoad,params);
    return result.data;
}
export async function rateList(params){
    const result = await axios.post(api.refundApply.rateList,params);
    return result.data;
}
export async function rateUpdate(params){
    const result = await axios.post(api.refundApply.rateUpdate,params);
    return result.data;
}
export async function add(params){
    const result = await axios.post(api.refundApply.add,params);
    return result.data;
}