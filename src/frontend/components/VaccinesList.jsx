
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const VaccinesList = ({ petId }) => {
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchVaccines();
    }, [petId]);

    const fetchVaccines = async () => {
        try {
            const data = await authService.getVaccines(petId);
            setVaccines(data);
        } catch (err) {
            console.error('Failed to fetch vaccines', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status, date, nextDue) => {
        // Simple logic: if status provided, use it. Else calculate.
        // Green (active), Yellow (due soon), Red (overdue)
        if (status === 'overdue') return '#ff4444';
        if (status === 'due_soon') return '#ffbb33';
        return '#00C851';
    };

    if (loading) return <div>Loading vaccines...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3>Vaccines</h3>
                <button
                    onClick={() => navigate(`/pet/${petId}/add-vaccine`)}
                    style={{ padding: '6px 12px', background: '#007aff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    + Add
                </button>
            </div>

            {vaccines.length === 0 ? (
                <p style={{ color: '#888' }}>No vaccines recorded.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {vaccines.map(v => (
                        <li key={v.id} style={{
                            background: '#f9f9f9',
                            padding: '10px',
                            marginBottom: '8px',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${getStatusColor(v.status)}`
                        }}>
                            <div style={{ fontWeight: 'bold' }}>{v.name}</div>
                            <div style={{ fontSize: '14px', color: '#666' }}>
                                Given: {v.date_administered}
                                {v.next_due_date && ` • Due: ${v.next_due_date}`}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

VaccinesList.propTypes = {
    petId: PropTypes.number.isRequired,
};

export default VaccinesList;
