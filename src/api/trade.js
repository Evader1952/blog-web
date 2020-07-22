import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.trade.list,params);
    return result.data;
}

export async function batchExport(params){
    const result = await axios.post(api.trade.batchExport,params);
    return result.data;
}

export async function add(params){
    const result = await axios.post(api.trade.add,params);
    return result.data;
}
export async function settle(params){
    const result = await axios.post(api.trade.settle,params);
    return result.data;
}

export async function getAmount(params){
    const result = await axios.post(api.trade.getAmount,params);
    return result.data;
}
export async function getAmountByTime(params){
    const result = await axios.post(api.trade.getAmountByTime,params);
    return result.data;
}