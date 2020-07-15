import axios from '../config/axios'
import api from './'

export async function fileList(params){
    const result = await axios.post(api.file.fileList,params);
    return result.data;
}
export async function downLoad(params){
    const result = await axios.post(api.file.downLoad,params);
    return result.data;
}
export async function getHref(params){
    const result = await axios.post(api.file.getHref,params);
    return result.data;
}
export async function h5List(params){
    const result = await axios.post(api.file.h5List,params);
    return result.data;
}
export async function changeSort(params){
    const result = await axios.post(api.file.changeSort,params);
    return result.data;
}