import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.merchantAccount.list,params);
    return result.data;
}


export async function getAreas(params){
    const result = await axios.post(api.merchantAccount.getAreas,params);
    return result.data;
}

export async function queryPwd(params){
    const result = await axios.post(api.merchantAccount.queryPwd,params);
    return result.data;
}
export async function update(params){
    const result = await axios.post(api.merchantAccount.update,params);
    return result.data;
}
export async function add(params){
    const result = await axios.post(api.merchantAccount.add,params);
    return result.data;
}

export async function batchImport(params){
    const result = await axios.post(api.merchantAccount.batchImport,params);
    return result.data;
}
export async function subsidiaryMerchantList(params){
    const result = await axios.post(api.merchantAccount.subsidiaryMerchantList,params);
    return result.data;
}

export async function addSubsidiaryMerchant(params){
    const result = await axios.post(api.merchantAccount.addSubsidiaryMerchant,params);
    return result.data;
}
export async function updateSubsidiaryMerchant(params){
    const result = await axios.post(api.merchantAccount.updateSubsidiaryMerchant,params);
    return result.data;
}

export async function updateDetail(params){
    const result = await axios.post(api.merchantAccount.updateDetail,params);
    return result.data;
}

export async function resetPwd(params){
    const result = await axios.post(api.merchantAccount.resetPwd,params);
    return result.data;
}
export async function addUser(params){
    const result = await axios.post(api.merchantAccount.addUser,params);
    return result.data;
}


export async function addByWayId(params){
    const result = await axios.post(api.merchantAccount.addByWayId,params);
    return result.data;
}

export async function userDimensionList(params){
    const result = await axios.post(api.merchantAccount.userDimensionList,params);
    return result.data;
}



export async function updateRange(params){
    const result = await axios.post(api.merchantAccount.updateRange,params);
    return result.data;
}

