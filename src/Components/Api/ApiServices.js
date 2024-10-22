import axios from "axios";
import ApiConnection from "./ApiConfig";
import { toast } from "react-toastify";
const URLConnection = ApiConnection();

export const getService = async () => {
    try {
        const response = await axios.get(`${URLConnection}/services`)
        const data = response.data
        return data.filter(service => service.status === true)
    } catch (error) {
        toast.error('Error al obtener los servicios.', error);
    }
}
export const getBookedSlots = async (date) => {
    try {
        const response = await axios.post(`${URLConnection}/dates/counts/times`,{date})
        return response.data.slots;
    } catch (error) {
        toast.error('Error al obtener los servicios.', error);
    }
}

export const getWorkedSchedule = async () =>{
    try {
        const response = await axios.get(`${URLConnection}/horarioGnral`)
        return response.data;
    } catch (error) {
        console.log('Error al obtener el horario laboral.', error);
    }
}

export const getWorkedExceptions = async () =>{
    try {
        const response = await axios.get(`${URLConnection}/horarioEXP`)
        return response.data;
    } catch (error) {
        console.log('Error getting horarioEXP', error)
    }
}

