import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.setmeal.list,params);
    return result.data;
}

export async function changeState(params){
    const result = await axios.post(api.setmeal.changeState,params);
    return result.data;
}

export async function update(params){
    const result = await axios.post(api.setmeal.update,params);
    return result.data;
}
