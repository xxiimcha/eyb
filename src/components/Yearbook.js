import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, Card, Button, Typography, Space, Spin, message } from "antd";

const { Title, Text } = Typography;

function YearbookBatches() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Fetch yearbook batches on load
    axios
      .get("http://localhost:5000/api/yearbook-batches")
      .then((res) => {
        setBatches(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching batches:", err);
        message.error("Failed to fetch batches. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleBatchClick = (batch) => {
    setSelectedBatch(batch);
    setSelectedDesignation(null); // Reset designation selection
    setAlumni([]); // Clear alumni list
  };

  const handleDesignationClick = (designation) => {
    setSelectedDesignation(designation);
    setLoading(true);

    // Fetch alumni by batch and designation
    axios
      .get(`http://localhost:5000/api/yearbook-batch/${selectedBatch.batch_id}`)
      .then((res) => {
        const filteredAlumni = res.data.filter(
          (alumnus) => alumnus.batch_type === designation
        );
        setAlumni(filteredAlumni);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching alumni:", err);
        message.error("Failed to fetch alumni. Please try again later.");
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Yearbook Batches</Title>

      {/* Loading Spinner */}
      {loading && (
        <Spin tip="Loading..." style={{ marginBottom: "20px" }} size="large" />
      )}

      {/* Batch List */}
      {!selectedBatch && !loading && (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={batches}
          renderItem={(batch) => (
            <List.Item>
              <Card
                hoverable
                title={batch.batch_year_range}
                onClick={() => handleBatchClick(batch)}
              >
                <Text>Click to view details</Text>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* Designation Selection */}
      {selectedBatch && !selectedDesignation && (
        <div>
          <Title level={3}>{selectedBatch.batch_year_range}</Title>
          <Space>
            <Button
              type="primary"
              onClick={() => handleDesignationClick("Regular")}
            >
              Regular
            </Button>
            <Button
              type="primary"
              onClick={() => handleDesignationClick("Mid-Year")}
            >
              Mid-Year
            </Button>
            <Button onClick={() => setSelectedBatch(null)}>Back</Button>
          </Space>
        </div>
      )}

      {/* Alumni List */}
      {selectedDesignation && !loading && (
        <div>
          <Title level={3}>
            {selectedBatch.batch_year_range} - {selectedDesignation}
          </Title>
          <List
            bordered
            dataSource={alumni}
            renderItem={(alumnus) => (
              <List.Item>
                <Space direction="vertical">
                  <Text>
                    <strong>Name:</strong> {alumnus.name}
                  </Text>
                  <Text>
                    <strong>Address:</strong> {alumnus.address || "N/A"}
                  </Text>
                  <Text>
                    <strong>Birthdate:</strong> {alumnus.birthdate}
                  </Text>
                  <Text>
                    <strong>Ambition:</strong> {alumnus.ambition || "N/A"}
                  </Text>
                </Space>
              </List.Item>
            )}
          />
          <Button style={{ marginTop: "20px" }} onClick={() => setSelectedDesignation(null)}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
}

export default YearbookBatches;
