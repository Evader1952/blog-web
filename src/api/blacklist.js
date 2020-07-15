import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.blacklist.list,params);
    return result.data;
}

export async function deleteBlack(params){
    const result = await axios.post(api.blacklist.deleteBlack,params);
    return result.data;
}

export async function shiftAdd(params) {
    const result = await axios.post(api.blacklist.add, params)
    return result.data
}
