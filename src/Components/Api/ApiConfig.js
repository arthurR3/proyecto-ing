const ApiConnection = () => {
    const isLocalConnection = window.location.hostname === 'localhost';

    return isLocalConnection ? 
    'http://localhost:5000/api/v1' :
    'https://160b-201-97-146-111.ngrok-free.app/api/v1';
}

export default ApiConnection;
