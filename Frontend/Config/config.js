import axios from "axios";

const BASE_URL = "http://backend:9000";

const ENDPOINTS = {
    post_data : `${BASE_URL}/postData`,
    get_data : `${BASE_URL}/getDataBases`,
    get_tables: `${BASE_URL}/getTables`,
    switch_db: `${BASE_URL}/switchDB`
}


const postData = async (data)=>{
    try {
        const response = await axios.post(ENDPOINTS.post_data, {data});
        if(response){
            return response
        }
    } catch (error) {
        return error
    }
}

const getDataBases = async ()=>{
    try {
        const response = await axios.get(ENDPOINTS.get_data);
        if(response){
            return response
        }
    } catch (error) {
        return error
    }
}

const getTables = async (db)=>{
    try {
        const response = await axios.get(ENDPOINTS.get_tables, {params: {db}})
        if(response){
            return response
        }
    } catch (error) {
        return error
    }
}

const switchDB = async(database)=>{
    try {
        const response = await axios.post(ENDPOINTS.switch_db, {database});
        if(response){
            return response
        }
    } catch (error) {
        return error
    }
}

export default {postData, getDataBases, getTables, switchDB}
