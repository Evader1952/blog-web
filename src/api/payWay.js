import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.payWay.list,params);
    return result.data;
}

export async function templateList(params){
    const result = await axios.post(api.payWay.templateList,params);
    return result.data;
}
export async function getPayWayConfig(params){
    const result = await axios.post(api.payWay.getPayWayConfig,params);
    return result.data;
}

export async function updatePayWay(params){
    const result = await axios.post(api.payWay.updatePayWay,params);
    return result.data;
}
