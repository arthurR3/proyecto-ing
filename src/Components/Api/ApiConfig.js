const ApiConnection = () => {
    const isLocalConnection = window.location.hostname === 'localhost';

    return isLocalConnection ? 
    'http://localhost:5000/api/v1' :
    'https://back-estetica-production-e475.up.railway.app';
}

export default ApiConnection;
