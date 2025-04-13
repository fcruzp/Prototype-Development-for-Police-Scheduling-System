import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/auth/Login';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    // Check if the login form elements are rendered
    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('handles input changes', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    // Get form inputs
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Check if inputs have the correct values
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('displays error message on failed login', async () => {
    // Mock axios.post to return an error
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    // Get form inputs and submit button
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    // Fill in the form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    // Verify that axios.post was called with the correct arguments
    expect(axios.post).toHaveBeenCalledWith(
      '/api/auth/login',
      {
        email: 'test@example.com',
        password: 'wrongpassword',
      }
    );
  });

  test('successfully logs in with valid credentials', async () => {
    // Mock successful login response
    const mockUser = {
      _id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@jcf.gov.jm',
      role: 'officer',
    };

    axios.post.mockResolvedValueOnce({
      data: {
        token: 'fake-token',
        user: mockUser,
      },
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    // Get form inputs and submit button
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    // Fill in the form
    fireEvent.change(emailInput, { target: { value: 'john.doe@jcf.gov.jm' } });
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify that axios.post was called with the correct arguments
    expect(axios.post).toHaveBeenCalledWith(
      '/api/auth/login',
      {
        email: 'john.doe@jcf.gov.jm',
        password: 'correctpassword',
      }
    );

    // Wait for the login process to complete
    await waitFor(() => {
      // We can't easily test navigation, but we can verify that localStorage was updated
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockUser);
    });
  });
});
