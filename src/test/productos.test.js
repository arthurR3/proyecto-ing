import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Products from '../pages/public/Products.js';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';
import Catalogo from '../features/Productos/Catalogo.js';

jest.mock('axios');

describe('Products Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading spinner correctly', () => {
        render(<Products />);
        expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
    });
});

describe('Products integration tests', () => {
    test('renders products after fetching from API', async () => {
        const products = [
            { id: 1, name: 'Product 1', status: true, Categoria: { name: 'Category 1' }, Marca: { name: 'Brand 1' }, price: 100 },
            { id: 2, name: 'Product 2', status: true, Categoria: { name: 'Category 2' }, Marca: { name: 'Brand 2' }, price: 100 },
            { id: 3, name: 'Product 3', status: false, Categoria: { name: "Category 3" }, Marca: { name: 'Brand 3' }, price: 100 },
        ];

        // Mock de llamada a la API para devolver productos
        axios.get.mockResolvedValueOnce({ data: products });

        // Renderiza el componente y espera que se carguen los productos
        await act(async () => {
            render(<Products />);
        });

        // Asegura que el spinner desaparezca al cargar los productos
        await waitFor(() => {
            expect(screen.queryByText(/Cargando.../i)).not.toBeInTheDocument();
        });

        // Log para verificar si los productos están cargados
        //console.log("Productos mockeados cargados:", products);

        // Verifica que los productos se renderizan correctamente
        waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });
        expect(screen.queryByText('Product 3')).not.toBeInTheDocument();

    });

    test('filters products by category and brand', async () => {
        const products = [
            { id: 1, name: 'Producto A', status: true, Categoria: { name: 'Categoría 1' }, Marca: { name: 'Marca 1' }, price: 100 },
            { id: 2, name: 'Producto B', status: true, Categoria: { name: 'Categoría 2' }, Marca: { name: 'Marca 2' }, price: 100 },
            { id: 3, name: 'Producto C', status: true, Categoria: { name: 'Categoría 1' }, Marca: { name: 'Marca 2' }, price: 100 },
        ];

        axios.get.mockResolvedValue({ data: products });

        render(<Products />);

        // Espera a que se carguen los productos
        const input = await screen.findByPlaceholderText('Buscar...');

        // Simula el cambio en el input de búsqueda
        fireEvent.change(input, { target: { value: 'Producto A' } });

        // Verifica que solo se muestre el producto A
        expect(screen.getByText('Producto A')).toBeInTheDocument();
        expect(screen.queryByText('Producto B')).not.toBeInTheDocument();

        const categorySelect = screen.getByLabelText('Seleccionar categoría');

        // Cambia el valor del filtro de categoría
        fireEvent.change(categorySelect, { target: { value: 'Categoría 1' } });

        waitFor(() => {
            expect(screen.getByText('Producto A')).toBeInTheDocument();
            expect(screen.getByText('Producto C')).toBeInTheDocument();
            expect(screen.queryByText('Producto B')).not.toBeInTheDocument();
        });
    });
});
