import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.refund.list,params);
    return result.data;
}

export async function changeRedPacketState(params){
    const result = await axios.post(api.refund.changeRedPacketState,params);
    return result.data;
}

export async function settle(params){
    const result = await axios.post(api.refund.settle,params);
    return result.data;
}

export async function changeRepaymentState(params){
    const result = await axios.post(api.refund.changeRepaymentState,params);
    return result.data;
}

export async function batchExport(params){
    const result = await axios.post(api.refund.batchExport,params);
    return result.data;
}