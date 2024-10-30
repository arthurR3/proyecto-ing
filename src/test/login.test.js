import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/public/Login/Login';
import { AuthContext } from '../Components/Context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');
jest.mock('react-google-recaptcha', () => () => <div>ReCAPTCHA Mock</div>);

describe('Login Component', () => {
  const mockAuthToken = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks(); 
});

  beforeEach(() => {
    render(
      <AuthContext.Provider value={{ authToken: mockAuthToken }}>
        <Router>
          <Login />
        </Router>
      </AuthContext.Provider>
    );
  });

  test('renders login form', () => {
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  /* test('shows a warning when fields are empty on submit', async () => {
    const submitButton = screen.getByRole('button', { name: /Acceder/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Completa todos los campos/i)).toBeInTheDocument();
    });
  });

  test('allows user to enter email and password', () => {
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('displays loader when form is submitted', async () => {
    axios.post.mockResolvedValue({ data: { success: true, data: 'fakeToken' } });
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: /Acceder/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Ingresando.../i)).toBeInTheDocument();
    });
  }); */
});


// INTEGRATION TESTING FOR FORGET PASSWORD
/* describe('Test de integración para recuperación de contraseña', () => {
  beforeEach(() => {
    axios.post.mockClear(); // Limpia el mock antes de cada prueba
  });

  test('envía el correo electrónico correctamente', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <ForEmail />
      </MemoryRouter>
    );

    // Simula la entrada del correo electrónico
    await act(async () => {
      fireEvent.change(getByLabelText(/correo electrónico/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.click(getByText(/enviar codigo/i));
    });

    // Asegúrate de esperar a que se resuelva la promesa
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/recover-password', {
        email: 'test@example.com',
      });
    });

    // Paso 2: Renderizar ValidationEmail y simular verificación de código
    render(
      <MemoryRouter>
        <ValidationEmail />
      </MemoryRouter>
    );

    const codeInput = screen.getByPlaceholderText('Ingrese el código de verificación');
    const verifyButton = screen.getByText(/Verificar/i);

    userEvent.type(codeInput, '123456');
    userEvent.click(verifyButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/verify-code', {
        code: '123456',
      });
    });

    // Paso 3: Renderizar ChangePassword y simular cambio de contraseña
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const repeatPasswordInput = screen.getByLabelText(/Repetir Contraseña/i);
    const changeButton = screen.getByText(/Cambiar Contraseña/i);

    userEvent.type(passwordInput, 'NewPassword123!');
    userEvent.type(repeatPasswordInput, 'NewPassword123!');
    userEvent.click(changeButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/change-password', {
        password: 'NewPassword123!',
      });
    });
  });
});
 */