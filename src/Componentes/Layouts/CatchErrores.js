import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Actualiza el estado para renderizar la interfaz de usuario de error en lugar de la interfaz de usuario que se rompió.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Puedes registrar el error en un servicio de informes de errores.
        console.error("Error:", error);
        console.error("Información del error:", errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Puedes renderizar cualquier interfaz de usuario de error personalizada aquí
            return <div className="alert alert-danger">¡Algo salió mal! Por favor, intente nuevamente. <button className='btn btn-success btn-line' onClick={() => Navigate(-1)}> Regresar</button></div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
