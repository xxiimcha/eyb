import React, { useState } from 'react';
import { Input, Button, Typography, Card, Row, Col, Space, Alert, Divider } from 'antd';

const { Title, Text } = Typography;

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
                console.log("Batch Details Received:", data);
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
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
            <Title level={2} style={{ color: '#52c41a' }}>Find Your Batch</Title>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <Space>
                    <Input
                        placeholder="Enter Private Key"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        style={{ width: '300px' }}
                        size="large"
                    />
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    >
                        Get Batch
                    </Button>
                </Space>
            </form>

            {/* Display Error */}
            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: '20px' }}
                />
            )}

            {/* Display Batch Details */}
            {batchDetails && (
                <Card
                    title={<Title level={3} style={{ color: '#52c41a', textAlign: 'center' }}>Batch Details</Title>}
                    style={{ textAlign: 'left', margin: '0 auto', width: '80%' }}
                >
                    <p><strong>Batch ID:</strong> {batchDetails.batch_id}</p>
                    <p><strong>Batch Type:</strong> {batchDetails.batch_type}</p>
                    <p><strong>Year Range:</strong> {batchDetails.batch_year_range}</p>

                    <Divider style={{ borderColor: '#52c41a' }} />

                    <Title level={4} style={{ color: '#52c41a', textAlign: 'center' }}>Users in the Same Batch</Title>
                    <Row gutter={[24, 24]} justify="center">
                        {batchDetails.users && batchDetails.users.length > 0 ? (
                            batchDetails.users.map((user, index) => (
                                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                    <Card
                                        hoverable
                                        style={{
                                            border: '1px solid #52c41a',
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            height: '250px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                        }}
                                        cover={
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '150px',
                                                    background: '#f0f0f0',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: '#999',
                                                    fontSize: '16px',
                                                }}
                                            >
                                                Image Placeholder
                                            </div>
                                        }
                                    >
                                        <Text style={{ fontWeight: 'bold', color: '#333' }}>{user.last_name || "N/A"}, {user.first_name || "N/A"} {user.middle_name || "N/A"}</Text><br></br>
                                        <Text style={{ marginTop: '10px', color: '#555' }}>{user.ambition || "N/A"}</Text>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Text>No users found in this batch.</Text>
                        )}
                    </Row>
                </Card>
            )}
        </div>
    );
}

export default Private;
