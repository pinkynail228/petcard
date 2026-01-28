import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/api';

const AddMedicalRecordScreen = () => {
    const { id } = useParams(); // pet id
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        record_date: '',
        record_type: 'visit',
        notes: '',
        vet_name: '',
        clinic_name: '',
        attachments: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.createMedicalRecord(id, formData);
            navigate(`/pet/${id}`);
        } catch (err) {
            console.error('Failed to add record', err);
            alert('Error adding medical record');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
                >
                    ←
                </button>
                <h1 style={{ margin: 0 }}>Add Record</h1>
            </header>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Date</label>
                    <input
                        type="date"
                        name="record_date"
                        value={formData.record_date}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Type</label>
                    <select
                        name="record_type"
                        value={formData.record_type}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', background: 'white' }}
                    >
                        <option value="visit">Visit</option>
                        <option value="lab">Lab Result</option>
                        <option value="prescription">Prescription</option>
                        <option value="surgery">Surgery</option>
                    </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Vet Name (Optional)</label>
                    <input
                        type="text"
                        name="vet_name"
                        value={formData.vet_name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Attachment URL (Optional)</label>
                    <input
                        type="text"
                        name="attachment_url"
                        value={formData.attachment_url}
                        onChange={handleChange}
                        placeholder="https://..."
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: '#007aff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginTop: '20px',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Saving...' : 'Add Record'}
                </button>
            </form>
        </div>
    );
};

export default AddMedicalRecordScreen;
