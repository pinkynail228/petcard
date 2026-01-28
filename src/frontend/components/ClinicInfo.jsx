import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { authService } from '../services/api';

const ClinicInfo = ({ petId }) => {
    const [clinic, setClinic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClinic();
    }, [petId]);

    const fetchClinic = async () => {
        try {
            const data = await authService.getClinic(petId);
            setClinic(data);
        } catch (err) {
            // 404 is expected if not connected
            if (err.response && err.response.status !== 404) {
                console.error('Failed to fetch clinic', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await authService.validateClinicCode(code, petId);
            fetchClinic(); // Refresh
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to connect');
        }
    };

    if (loading) return <div>Loading clinic info...</div>;

    if (clinic) {
        return (
            <div>
                <h3>Connected Clinic</h3>
                <div style={{ background: '#e8f5e9', padding: '16px', borderRadius: '12px', border: '1px solid #c8e6c9' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{clinic.clinic_name}</div>
                    {clinic.clinic_phone && <div style={{ marginTop: '8px' }}>📞 {clinic.clinic_phone}</div>}
                    <div style={{ marginTop: '12px', fontSize: '14px', color: '#2e7d32' }}>✓ Connected</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3>Connect Clinic</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Enter the unique code provided by your veterinary clinic to link your pet.</p>

            <form onSubmit={handleConnect} style={{ marginTop: '16px' }}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Clinic Code (e.g. VET-123)"
                    style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
                {error && <div style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>{error}</div>}

                <button
                    type="submit"
                    style={{
                        marginTop: '12px',
                        width: '100%',
                        padding: '12px',
                        background: '#007aff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500'
                    }}
                >
                    Connect
                </button>
            </form>
        </div>
    );
};

ClinicInfo.propTypes = {
    petId: PropTypes.number.isRequired,
};

export default ClinicInfo;
