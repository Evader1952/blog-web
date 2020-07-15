import axios from '../config/axios'
import api from './'

export async function list(params){
    const result = await axios.post(api.recharge.list,params);
    return result.data;
}

export async function doRecharge(params){
    const result = await axios.post(api.recharge.doRecharge,params);
    return result.data;
}
export async function getSetMealPlans(params){
    const result = await axios.post(api.recharge.getSetMealPlans,params);
    return result.data;
}

export async function setSetMealPlan(params){
    const result = await axios.post(api.recharge.setSetMealPlan,params);
    return result.data;
}