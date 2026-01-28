import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import VaccinesList from '../components/VaccinesList';
import MedicalRecordsList from '../components/MedicalRecordsList';
import ClinicInfo from '../components/ClinicInfo';

const PetProfileScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const petId = parseInt(id);

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('vaccines');

    useEffect(() => {
        fetchPet();
    }, [petId]);

    const fetchPet = async () => {
        try {
            const data = await authService.getPet(petId);
            setPet(data);
        } catch (err) {
            console.error('Failed to fetch pet', err);
            // navigate('/'); // Redirect if not found?
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
            try {
                await authService.deletePet(petId);
                navigate('/');
            } catch (err) {
                console.error('Failed to delete pet', err);
                alert('Failed to delete pet');
            }
        }
    };

    if (loading) return <div className="p-4">Loading profile...</div>;
    if (!pet) return <div className="p-4">Pet not found</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
                    >
                        ←
                    </button>
                    <h1 style={{ margin: 0 }}>{pet.name}</h1>
                </div>
                <button onClick={() => navigate(`/edit-pet/${petId}`)} style={{ color: '#007aff', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
                    Edit
                </button>
            </header>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <div
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#ddd',
                        marginRight: '20px',
                        backgroundImage: pet.photo_url ? `url(${pet.photo_url})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px'
                    }}
                >
                    {!pet.photo_url && (pet.species === 'cat' ? '🐱' : '🐶')}
                </div>
                <div>
                    <p style={{ margin: '0 0 4px' }}><strong>Breed:</strong> {pet.breed || 'Unknown'}</p>
                    <p style={{ margin: '0 0 4px' }}><strong>Age:</strong> {pet.dob ? new Date().getFullYear() - new Date(pet.dob).getFullYear() : 'Unknown'} yrs</p>
                    <p style={{ margin: '0' }}><strong>Weight:</strong> {pet.weight_kg || '-'} kg</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                {['vaccines', 'records', 'clinic'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab ? '2px solid #007aff' : '2px solid transparent',
                            color: activeTab === tab ? '#007aff' : '#888',
                            fontWeight: activeTab === tab ? '600' : '400',
                            textTransform: 'capitalize',
                            cursor: 'pointer'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ minHeight: '300px' }}>
                {activeTab === 'vaccines' && <VaccinesList petId={petId} />}
                {activeTab === 'records' && <MedicalRecordsList petId={petId} />}
                {activeTab === 'clinic' && <ClinicInfo petId={petId} />}
            </div>

            <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <button
                    onClick={handleDelete}
                    style={{ width: '100%', padding: '12px', color: '#ff4444', background: 'none', border: '1px solid #ff4444', borderRadius: '12px' }}
                >
                    Delete Pet
                </button>
            </div>
        </div>
    );
};

export default PetProfileScreen;
