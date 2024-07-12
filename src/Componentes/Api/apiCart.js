import axios from 'axios';
import ApiConnection from './ApiConfig';
import { toast } from 'react-toastify';

const URLConnection = ApiConnection();


export const updateCart = async (state, idUser) => {
    try {
        if(state.quantity > state.amount) {
            toast.warn('La cantidad solicitada supera el stock disponible');
            return;
        }
        const response = await axios.put(`${URLConnection}/carts/updateCart/${idUser}`, {
            state
        });
        const { success } = response.data;
        if (success) {
            localStorage.removeItem('Cart');
        }
    } catch (error) {
            console.error(error);
            toast.error('Error sending (updateCart)', error);
        
    }
};

export const deleteCart = () =>{
    
}


