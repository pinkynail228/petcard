/* eslint-env jest */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PetProfileScreen from '../../screens/PetProfileScreen';
import { authService } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

// Mocks
jest.mock('../../services/api', () => ({
    authService: {
        getPet: jest.fn(),
        deletePet: jest.fn()
    }
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
}));

// Mock child components
jest.mock('../../components/VaccinesList', () => () => <div data-testid="vaccines-list">VaccinesList</div>);
jest.mock('../../components/MedicalRecordsList', () => () => <div data-testid="records-list">RecordsList</div>);
jest.mock('../../components/ClinicInfo', () => () => <div data-testid="clinic-info">ClinicInfo</div>);

describe('PetProfileScreen', () => {
    const mockNavigateFn = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigateFn);
        useParams.mockReturnValue({ id: '1' });
    });

    test('renders loading state', () => {
        authService.getPet.mockImplementation(() => new Promise(() => { }));
        render(<PetProfileScreen />);
        expect(screen.getByText(/Loading profile/i)).toBeInTheDocument();
    });

    test('renders pet info', async () => {
        authService.getPet.mockResolvedValue({
            id: 1,
            name: 'Buddy',
            species: 'Dog',
            breed: 'Golden',
            dob: '2020-01-01',
            weight_kg: 25
        });

        render(<PetProfileScreen />);

        await waitFor(() => {
            expect(screen.getByText(/Buddy/i)).toBeInTheDocument();
            expect(screen.getByText(/Golden/i)).toBeInTheDocument();
            expect(screen.getByText(/Weight:/i)).toBeInTheDocument();
            expect(screen.getByText(/25 kg/i)).toBeInTheDocument();
        });
    });

    test('switches tabs', async () => {
        authService.getPet.mockResolvedValue({ id: 1, name: 'Buddy' });
        render(<PetProfileScreen />);

        await waitFor(() => expect(screen.getByText(/Buddy/i)).toBeInTheDocument());

        // Default tab is vaccines
        expect(screen.getByTestId('vaccines-list')).toBeInTheDocument();

        // Switch to records
        fireEvent.click(screen.getByText(/records/i));
        expect(screen.getByTestId('records-list')).toBeInTheDocument();

        // Switch to clinic
        fireEvent.click(screen.getByText(/clinic/i));
        expect(screen.getByTestId('clinic-info')).toBeInTheDocument();
    });
});
