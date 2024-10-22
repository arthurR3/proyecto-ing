const SessionStorage ={
    saveSession: (userData) =>{
        // Aqui se guarda la informacion de sesion en localStorage con marca de tiempo
        const sessionData ={
            userData,
            timestamp : new Date().getTime(),
        };
        localStorage.setItem('sessionData', JSON.stringify(sessionData));
    },

    // OBTIENES LA INFORMACION DE SESION DESDE EL LOCALSTORAGE

    getSession : ()=>{
        const sessionData = localStorage.getItem('sessionData');
        return sessionData ? JSON.parse(sessionData) : null;
    },

    // ELIMINAR LA INFORMACION DE SESION DEL LOCALSTORAGE
    clearSession : ()=>{
        localStorage.removeItem('sessionData');
    },

    // SE VERIFICA SI HAY UNA SESION ACTIVA
    hasSession : () =>{
        const sessionData = localStorage.getItem('sessionData');
        if(sessionData){
            const {timestamp} = JSON.parse(sessionData);
            const currentTime = new Date().getTime();
            const sessionTimeout = 60 *60 *1000;
            return currentTime - timestamp < sessionTimeout;
        }
        return false;
    },

    // ACTUALIZAR LA MARCA DE TIEMPO DE LA SESION CON ACTIVIDAD
    updateSessionTime : () =>{
        const sessionData = SessionStorage.getSession();
        if(sessionData){
            sessionData.timestamp = new Date().getTime();
            localStorage.setItem('sessionData', JSON.stringify(sessionData));
        }
    },
};

export default SessionStorage;