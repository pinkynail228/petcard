import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/api';
import PetForm from '../components/PetForm';

const EditPetScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pet, setPet] = useState(null);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const data = await authService.getPet(id);
                setPet(data);
            } catch (err) {
                console.error('Failed to fetch pet', err);
                navigate('/');
            }
        };
        fetchPet();
    }, [id, navigate]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await authService.updatePet(id, formData);
            navigate(`/pet/${id}`);
        } catch (err) {
            console.error('Failed to update pet', err);
            alert('Error updating pet');
        } finally {
            setLoading(false);
        }
    };

    if (!pet) return <div>Loading...</div>;

    return <PetForm title="Edit Pet" initialData={pet} onSubmit={handleSubmit} loading={loading} />;
};

export default EditPetScreen;
