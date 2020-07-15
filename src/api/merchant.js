import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.merchant.list, params)
    return result.data;
}

export async function detail(params){
    const result = await axios.post(api.merchant.detail,params);
    return result.data;
}

export async function updateMerchant(params){
    const result = await axios.post(api.merchant.updateMerchant,params);
    return result.data;
}

export async function commitInfoToMyBank(params){
    const result = await axios.post(api.merchant.commitInfoToMyBank,params);
    return result.data;
}

export async function batchExport(params){
    const result = await axios.post(api.merchant.batchExport, params)
    return result.data;
}

export async function getAreaListByLevelOrParentCode(params){
    const result = await axios.post(api.merchant.getAreaListByLevelOrParentCode, params)
    return result.data;
}

export async function reviewMerchant(params){
    const result = await axios.post(api.merchant.reviewMerchant, params)
    return result.data;
}

export async function merchantList(params){
    const result = await axios.post(api.merchant.merchantList, params)
    return result.data;
}
export async function getChangeLog(params){
    const result = await axios.post(api.merchant.getChangeLog, params)
    return result.data;
}
export async function getMerchantManage(params){
    const result = await axios.post(api.merchant.getMerchantManage, params)
    return result.data;
}
export async function changePayState(params){
    const result = await axios.post(api.merchant.changePayState, params)
    return result.data;
}
export async function changePayWay(params){
    const result = await axios.post(api.merchant.changePayWay, params)
    return result.data;
}

export async function open(params){
    const result = await axios.post(api.merchant.open, params)
    return result.data;
}