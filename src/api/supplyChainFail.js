import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.supplyChainFail.list,params);
    return result.data;
}

export async function addWhite(params){
    const result = await axios.post(api.supplyChainFail.addWhite,params);
    return result.data;
}

export async function selectAccount(params){
    const result = await axios.post(api.supplyChainFail.selectAccount,params);
    return result.data;
}

export async function updateAccount(params){
    const result = await axios.post(api.supplyChainFail.updateAccount,params);
    return result.data;
}

export async function settle(params){
    const result = await axios.post(api.supplyChainFail.settle,params);
    return result.data;
}
