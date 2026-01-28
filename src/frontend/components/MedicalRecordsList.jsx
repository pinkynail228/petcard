
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const MedicalRecordsList = ({ petId }) => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecords();
    }, [petId]);

    const fetchRecords = async () => {
        try {
            const data = await authService.getMedicalRecords(petId);
            setRecords(data);
        } catch (err) {
            console.error('Failed to fetch records', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading records...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3>Medical Records</h3>
                <button
                    onClick={() => navigate(`/pet/${petId}/add-record`)}
                    style={{ padding: '6px 12px', background: '#007aff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    + Add
                </button>
            </div>

            {records.length === 0 ? (
                <p style={{ color: '#888' }}>No medical records found.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {records.map(r => (
                        <li key={r.id} style={{
                            background: '#f9f9f9',
                            padding: '10px',
                            marginBottom: '8px',
                            borderRadius: '8px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold' }}>{r.record_type}</span>
                                <span style={{ fontSize: '12px', color: '#888' }}>{r.date}</span>
                            </div>
                            <div style={{ fontSize: '14px', color: '#444', marginTop: '4px' }}>
                                {r.notes}
                            </div>
                            {r.vet_name && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Vet: {r.vet_name}</div>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

MedicalRecordsList.propTypes = {
    petId: PropTypes.number.isRequired,
};

export default MedicalRecordsList;
