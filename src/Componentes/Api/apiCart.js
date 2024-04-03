import axios from 'axios';
import ApiConnection from './ApiConfig';

const URLConnection = ApiConnection();


export const updateCart = async (state, idUser) => {
    try {
       const response =  await axios.put(`${URLConnection}/carts/updateCart/${idUser}`, {
            state
        });
        const {success} = response.data
        if(success){
            localStorage.removeItem('Cart')
        }
    } catch (error) {
        console.error(error);
        //throw new Error('Error sending (updateCart)', error);
    }
};

