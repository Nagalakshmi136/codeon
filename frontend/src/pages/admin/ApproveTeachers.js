import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const ApproveTeachers = () => {
    const [pendingTeachers, setPendingTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState(''); // Error for specific actions

    const fetchPendingTeachers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/admin/teachers/pending');
            setPendingTeachers(res.data);
        } catch (err) {
            setError('Failed to load pending teachers.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []); // useCallback avoids re-creating function unnecessarily

    useEffect(() => {
        fetchPendingTeachers();
    }, [fetchPendingTeachers]); // Run on mount and if function identity changes (it won't here)

    const handleApproval = async (id, action) => {
        setActionError('');
        const originalTeachers = [...pendingTeachers]; // Store original state
        // Optimistic UI update: Remove the teacher immediately
        setPendingTeachers(currentTeachers => currentTeachers.filter(t => t._id !== id));

        try {
            if (action === 'approve') {
                await api.put(`/api/admin/teachers/${id}/approve`);
                 // Optionally show a success message
            } else if (action === 'reject') {
                await api.put(`/api/admin/teachers/${id}/reject`);
                 // Optionally show a success message
            }
             // No need to refetch if optimistic update is enough
             // fetchPendingTeachers(); // Or refetch to be absolutely sure
        } catch (err) {
            setActionError(`Failed to ${action} teacher ${id}.`);
            console.error(err);
            setPendingTeachers(originalTeachers); // Revert UI on error
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Approve Teacher Registrations</h2>
            {actionError && <p style={{ color: 'red' }}>{actionError}</p>}
            {pendingTeachers.length === 0 ? (
                <p>No pending teacher registrations.</p>
            ) : (
                <ul>
                    {pendingTeachers.map(teacher => (
                        <li key={teacher._id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <span>{teacher.name} ({teacher.email}) - Registered: {new Date(teacher.createdAt).toLocaleDateString()}</span>
                            <div>
                                <button onClick={() => handleApproval(teacher._id, 'approve')} style={{background:'green', color:'white', marginRight:'5px'}}>Approve</button>
                                <button onClick={() => handleApproval(teacher._id, 'reject')} style={{background:'red', color:'white'}}>Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ApproveTeachers;