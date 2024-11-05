
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {Routes, BrowserRouter as Router, MemoryRouter, useParams, Route } from 'react-router-dom';


import Servicios from '../pages/public/Servicios';
import ServiceList from '../features/Servicios/ServiciosList';
// Mockeamos el componente ServiceList para esta prueba
import ServicesList from '../pages/public/ServiciosAgendar/ServicesList'
import axios from 'axios';
import Agenda from '../pages/public/ServiciosAgendar/Agenda';
import * as ApiServices from '../Components/Api/ApiServices';
import * as ServiciosTime from '../Components/Servicios/ServiciosTime';

jest.mock('../Components/Api/ApiServices');
jest.mock('../Components/Servicios/ServiciosTime');
jest.mock('../Components/Loading/Loading.js', () => () => <div>Loading...</div>);
jest.mock('../features/Servicios/ServicePay.js', () => () => <div>ServicesPay Component</div>);

// Mock de axios y useNavigate
jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('../features/Servicios/ServiciosList', () => () => <div>Mock Service List</div>);

describe('Servicios Component', () => {
  
  test('renders the main header and subtitle', () => {
    render(<Router><Servicios /></Router>);
  });

  test('renders the image with correct src', () => {
    render(<Router><Servicios /></Router>);
    
    const image = screen.getByAltText(/Beauty Services/i);
    expect(image).toBeInTheDocument();
    
    // Verificamos que la URL de la imagen sea la correcta
    expect(image).toHaveAttribute('src', 'https://www.beautymarket.es/imagen/min18484.jpg');
  });
});


describe('ServicesList', () => {
    beforeEach(() => {
        // Configurar valores de mock
        useParams.mockReturnValue({ category: 'Categoría Test' });
        require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('muestra los servicios filtrados y permite la navegación de regreso', async () => {
        const mockServices = [
            { id: 1, name: 'Servicio 1', Categoria: { name: 'Categoría Test' }, status: true, price: 100 , duration:'1:00:00'},
            { id: 2, name: 'Servicio 2', Categoria: { name: 'Categoría Test' }, status: true,  price: 100 , duration:'2:00:00'  },
            { id: 3, name: 'Servicio 3', Categoria: { name: 'Otra Categoría' }, status: true ,  price: 100 , duration:'2:00:00' },
            { id: 4, name: 'Servicio 4', Categoria: { name: 'Categoría Test' }, status: false , price: 100 , duration:'1:00:00' }, // Inactivo
        ];

        // Mockear la respuesta de axios
        axios.get.mockResolvedValue({ data: mockServices });

        render( 
            <MemoryRouter initialEntries={['/services/Categoría Test']}>
                <Routes>
                    <Route path="/services/:category" element={<ServicesList />} />
                </Routes>
            </MemoryRouter>
        );

        // Verificar que se muestra el título con la categoría
        expect(screen.getByText('Servicios en Categoría Test')).toBeInTheDocument();

        // Esperar hasta que los servicios se carguen y se filtren
        await waitFor(() => {
            expect(screen.getByText('Servicio 1')).toBeInTheDocument();
            expect(screen.getByText('Servicio 2')).toBeInTheDocument();
        });

        // Verificar que los servicios filtrados por categoría y estado activo están presentes
        expect(screen.queryByText('Servicio 3')).not.toBeInTheDocument();
        expect(screen.queryByText('Servicio 4')).not.toBeInTheDocument();

        // Simular el clic en "Regresar" y verificar la navegación
        fireEvent.click(screen.getByText('Regresar'));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

});
