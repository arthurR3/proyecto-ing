import axios from "axios";
import ApiConnection from "./ApiConfig";
import { toast } from "react-toastify";
const URLConnection = ApiConnection();

export const getService = async () => {
    try {
        const response = await axios.get(`${URLConnection}/services`)
        return response.data;
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


