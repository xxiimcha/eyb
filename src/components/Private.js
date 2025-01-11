import React, { useState } from 'react';

function Private() {
    const [privateKey, setPrivateKey] = useState('');
    const [batchDetails, setBatchDetails] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setBatchDetails(null);

        try {
            const response = await fetch('http://localhost:5000/api/getBatch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ privateKey }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Batch Details Received:", data); // Log the received data
                setBatchDetails(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error fetching batch');
            }
        } catch (err) {
            setError('Unable to connect to server');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Find Your Batch</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Enter Private Key"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px', width: '300px' }}
                />
                <button
                    type="submit"
                    style={{ marginLeft: '10px', padding: '10px', fontSize: '16px' }}
                >
                    Get Batch
                </button>
            </form>

            {/* Display Batch Details */}
            {batchDetails && (
                <div style={{ textAlign: 'left', margin: '0 auto', width: '50%' }}>
                    <h2 style={{ color: 'green' }}>Batch Details</h2>
                    <p><strong>Batch ID:</strong> {batchDetails.batch_id}</p>
                    <p><strong>Batch Type:</strong> {batchDetails.batch_type}</p>
                    <p><strong>Year Range:</strong> {batchDetails.batch_year_range}</p>

                    <h3>Users in the Same Batch:</h3>
                    <ul>
                        {batchDetails.users && batchDetails.users.length > 0 ? (
                            batchDetails.users.map((user, index) => (
                                <li key={index} style={{ marginBottom: '10px' }}>
                                    <strong>Name:</strong> {user.first_name || "N/A"} {user.middle_name || "N/A"} {user.last_name || "N/A"} <br />
                                    <strong>Ambition:</strong> {user.ambition || "N/A"}
                                </li>
                            ))
                        ) : (
                            <p>No users found in this batch.</p>
                        )}
                    </ul>
                </div>
            )}

            {/* Display Error */}
            {error && <p style={{ color: 'red', fontSize: '18px' }}>{error}</p>}
        </div>
    );
}

export default Private;
