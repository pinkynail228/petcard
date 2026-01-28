/* eslint-env jest */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HomeScreen from '../../screens/HomeScreen';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Mocks
jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn()
}));

jest.mock('../../services/api', () => ({
    authService: {
        getPets: jest.fn(),
        getVaccines: jest.fn()
    }
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

describe('HomeScreen', () => {
    const mockNavigateFn = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({ user: { id: 1, first_name: 'Test' } });
        useNavigate.mockReturnValue(mockNavigateFn);
    });

    test('renders loading state initially', async () => {
        authService.getPets.mockImplementation(() => new Promise(() => { })); // Hang forever
        render(<HomeScreen />);
        expect(screen.getByText(/Loading pets/i)).toBeInTheDocument();
    });

    test('renders empty state when no pets', async () => {
        authService.getPets.mockResolvedValue([]);
        render(<HomeScreen />);

        await waitFor(() => {
            expect(screen.getByText(/No pets added yet/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/\+ Add First Pet/i)).toBeInTheDocument();
    });

    test('renders pets list', async () => {
        const mockPets = [
            { id: 1, name: 'Fluffy', species: 'Cat', breed: 'Persian', photo_url: null }
        ];
        authService.getPets.mockResolvedValue(mockPets);
        authService.getVaccines.mockResolvedValue([]);

        render(<HomeScreen />);

        await waitFor(() => {
            expect(screen.getByText(/Fluffy/i)).toBeInTheDocument();
            expect(screen.getByText(/Persian/i)).toBeInTheDocument();
        });
    });

    test('renders pet with next due vaccine', async () => {
        const mockPets = [{ id: 1, name: 'Rover', species: 'Dog' }];
        authService.getPets.mockResolvedValue(mockPets);
        authService.getVaccines.mockResolvedValue([
            { id: 10, name: 'Rabies', next_due_date: '2025-01-01' }
        ]);

        render(<HomeScreen />);

        await waitFor(() => {
            expect(screen.getByText(/Rover/i)).toBeInTheDocument();
            expect(screen.getByText(/Due: 2025-01-01/i)).toBeInTheDocument();
        });
    });
});
