import axios from "axios";

const codigosPostal = async (codigoPostal) => {
    const options = {
        method: 'GET',
        url: `https://mexico-zip-codes3.p.rapidapi.com/${codigoPostal}`,
        headers: {
            'X-RapidAPI-Key': 'd4431c3458mshfe98d909d8dbd37p15b919jsn93d80fe070d3',
            'X-RapidAPI-Host': 'mexico-zip-codes3.p.rapidapi.com'
          }
    };

    try {
        const response = await axios.request(options);
        if(response.data){
            return response.data;
        }else{
            return null
        }
    } catch (error) {
        console.error(-'Error al obtener la informacion' ,error);
        throw error;
    }
}

export default codigosPostal;