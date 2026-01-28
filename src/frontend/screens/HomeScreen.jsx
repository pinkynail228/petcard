import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
    const { user } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const petsData = await authService.getPets();

            // Fetch vaccines for each pet to find "Next Due"
            const petsWithVaccines = await Promise.all(
                petsData.map(async (pet) => {
                    try {
                        const vaccines = await authService.getVaccines(pet.id);
                        // logic to find next due
                        // Filter active vaccines with raw future dates or "active" status?
                        // Schema: next_due_date is Date.
                        // Find earliest next_due_date that is today or future? Or overdue?
                        const nextDue = vaccines
                            .filter(v => v.next_due_date)
                            .sort((a, b) => new Date(a.next_due_date) - new Date(b.next_due_date))[0];

                        return { ...pet, nextDue };
                    } catch (e) {
                        console.warn(`Failed to fetch vaccines for pet ${pet.id}`, e);
                        return pet;
                    }
                })
            );

            setPets(petsWithVaccines);
        } catch (err) {
            console.error('Failed to fetch pets', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-4">Loading pets...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>My Pets</h1>
                <button
                    onClick={() => navigate('/settings')}
                    style={{ padding: '8px', background: 'transparent', border: 'none', color: '#007aff', fontSize: '16px' }}
                >
                    Settings
                </button>
            </header>

            {pets.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
                    <p>No pets added yet.</p>
                    <button
                        onClick={() => navigate('/add-pet')}
                        style={{ marginTop: '20px', padding: '12px 24px', background: '#007aff', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px' }}
                    >
                        + Add First Pet
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {pets.map((pet) => (
                        <div
                            key={pet.id}
                            onClick={() => navigate(`/pet/${pet.id}`)}
                            style={{
                                padding: '16px',
                                background: '#f5f5f7',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: '#ddd',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    marginRight: '16px',
                                    backgroundImage: pet.photo_url ? `url(${pet.photo_url})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px'
                                }}
                            >
                                {!pet.photo_url && (pet.species === 'cat' ? '🐱' : '🐶')}
                            </div>

                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{pet.name}</h3>
                                <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
                                    {pet.breed || pet.species}
                                </p>
                                {pet.nextDue && (
                                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffcc00' }}></span>
                                        <span style={{ fontSize: '12px', color: '#ff9500', fontWeight: '500' }}>
                                            Due: {pet.nextDue.next_due_date} ({pet.nextDue.name})
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div style={{ color: '#ccc' }}>›</div>
                        </div>
                    ))}

                    <button
                        onClick={() => navigate('/add-pet')}
                        style={{ marginTop: '10px', padding: '12px', border: '2px dashed #ddd', borderRadius: '12px', background: 'transparent', color: '#888', fontWeight: '500' }}
                    >
                        + Add Another Pet
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomeScreen;
