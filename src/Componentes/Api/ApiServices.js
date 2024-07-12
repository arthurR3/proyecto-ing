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

