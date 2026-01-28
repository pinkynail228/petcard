import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import PetForm from '../components/PetForm';

const AddPetScreen = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await authService.createPet(formData);
            navigate('/');
        } catch (err) {
            console.error('Failed to create pet', err);
            alert('Error creating pet');
        } finally {
            setLoading(false);
        }
    };

    return <PetForm title="Add New Pet" onSubmit={handleSubmit} loading={loading} />;
};

export default AddPetScreen;
