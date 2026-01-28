/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginScreen from '../../screens/LoginScreen';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock imports
jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

describe('LoginScreen Component', () => {
    const mockLogin = jest.fn();
    const mockNavigateFn = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({
            login: mockLogin,
            loading: false,
            error: null
        });
        useNavigate.mockReturnValue(mockNavigateFn);
    });

    test('renders login title', () => {
        render(<LoginScreen />);
        expect(screen.getByText(/PetCard Login/i)).toBeInTheDocument();
    });

    test('shows loading state', () => {
        useAuth.mockReturnValue({
            login: mockLogin,
            loading: true,
            error: null
        });
        render(<LoginScreen />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    test('shows error message', () => {
        useAuth.mockReturnValue({
            login: mockLogin,
            loading: false,
            error: 'Invalid Token'
        });
        render(<LoginScreen />);
        expect(screen.getByText(/Invalid Token/i)).toBeInTheDocument();
    });

    test('handles dev login submission', async () => {
        render(<LoginScreen />);

        const input = screen.getByPlaceholderText(/Telegram ID/i);
        const button = screen.getByRole('button', { name: /Login/i });

        fireEvent.change(input, { target: { value: '12345' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(expect.objectContaining({
                id: '12345'
            }));
            expect(mockNavigateFn).toHaveBeenCalledWith('/');
        });
    });
});
