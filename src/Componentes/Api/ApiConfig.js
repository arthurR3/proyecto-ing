const ApiConnection = () => {
    const isLocalConnection = window.location.hostname === 'localhost';

    return isLocalConnection ? 
    'http://localhost:5000/api/v1' :
    'https://back-estetica-production-710f.up.railway.app/api/v1';
}

export default ApiConnection;
