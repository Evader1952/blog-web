import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.offlineSettle.list,params);
    return result.data;
}

export async function exportTemplate(params){
    const result = await axios.post(api.offlineSettle.exportTemplate,params);
    return result.data;
}
export async function batchImport(params){
    const result = await axios.post(api.offlineSettle.batchImport,params);
    return result.data;
}

