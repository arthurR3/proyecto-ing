/* import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './pages/public/Login/Login'; 
import { AuthContext } from './Components/Context/AuthContext'; 
import { BrowserRouter as Router } from 'react-router-dom';

// Mock de funciones y componentes que se usan en Login
jest.mock('axios');
jest.mock('react-google-recaptcha', () => () => <div>ReCAPTCHA Mock</div>);

describe('Login Component', () => {
  const mockAuthToken = jest.fn();

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

  test('allows user to enter email and password', () => {
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows a warning when fields are empty on submit', () => {
    const submitButton = screen.getByRole('button', { name: /Acceder/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/Completa todos los campos/i)).toBeInTheDocument();
  });

});
