import axios from "axios";

const codigosPostal = async (codigoPostal) => {
    //console.log(process.env.REACT_APP_RapiKey)
    const options = {
        method: 'GET',
        url: `https://codigos-postales-mx.p.rapidapi.com/cp/${codigoPostal}`,
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RapiKey,
          'X-RapidAPI-Host': 'codigos-postales-mx.p.rapidapi.com'
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