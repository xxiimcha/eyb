import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Typography,
  Row,
  Col,
  message,
  Card,
} from "antd";
import './css/YearbookProfileForm.css';

const { Title } = Typography;
const { Option } = Select;

function YearbookProfileForm() {
  const [batches, setBatches] = useState([]); // State for batches
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [form] = Form.useForm();

  // Fetch Batches
  useEffect(() => {
    fetch("http://localhost:5000/api/get-batches")
      .then((response) => response.json())
      .then((data) => setBatches(data))
      .catch((error) => console.error("Error fetching batches:", error));
  }, []);

  // Fetch Regions
  useEffect(() => {
    fetch("https://psgc-api.kgsoftwares.com/api/regions")
      .then((response) => response.json())
      .then((data) => setRegions(data))
      .catch((error) => console.error("Error fetching regions:", error));
  }, []);

  const fetchProvinces = (regionCode) => {
    fetch(`https://psgc-api.kgsoftwares.com/api/regions/${regionCode}/provinces`)
      .then((response) => response.json())
      .then((data) => {
        setProvinces(data);
        setCities([]);
        setBarangays([]);
      })
      .catch((error) => console.error("Error fetching provinces:", error));
  };

  const fetchCities = (provinceCode) => {
    fetch(`https://psgc-api.kgsoftwares.com/api/provinces/${provinceCode}/cities`)
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
        setBarangays([]);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  };

  const fetchBarangays = (cityCode) => {
    fetch(`https://psgc-api.kgsoftwares.com/api/cities-municipalities/${cityCode}/barangays`)
      .then((response) => response.json())
      .then((data) => setBarangays(data))
      .catch((error) => console.error("Error fetching barangays:", error));
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch("http://localhost:5000/api/yearbook-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          profile_photo: null, // Placeholder for photo logic
        }),
      });

      if (response.ok) {
        const result = await response.json();
        message.success("Profile added successfully!");
        console.log("Response Data:", result);
      } else {
        const error = await response.json();
        message.error(`Error: ${error.error}`);
        console.error("Error Response:", error);
      }
    } catch (error) {
      message.error("An error occurred while submitting the form.");
      console.error("Submission Error:", error);
    }
  };

  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Card
        style={{ maxWidth: "900px", margin: "0 auto", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        bodyStyle={{ padding: "40px" }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
          Yearbook Profile Form
        </Title>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: "800px", margin: "0 auto" }}
          onFinish={handleSubmit}
        >
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item name="batch_id" label="Batch" rules={[{ required: true, message: "Please select a batch!" }]}>
                <Select placeholder="Select Batch">
                  {batches.map((batch) => (
                    <Option key={batch.batch_id} value={batch.batch_id}>
                      {batch.batch_year_range} ({batch.batch_type})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="region" label="Region" rules={[{ required: true, message: "Please select a region!" }]}>
                <Select
                  placeholder="Select Region"
                  onChange={(value) => fetchProvinces(value)}
                >
                  {regions.map((region) => (
                    <Option key={region.code} value={region.code}>
                      {region.regionName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item name="province" label="Province" rules={[{ required: true, message: "Please select a province!" }]}>
                <Select
                  placeholder="Select Province"
                  onChange={(value) => fetchCities(value)}
                >
                  {provinces.map((province) => (
                    <Option key={province.code} value={province.code}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="city" label="City" rules={[{ required: true, message: "Please select a city!" }]}>
                <Select
                  placeholder="Select City"
                  onChange={(value) => fetchBarangays(value)}
                >
                  {cities.map((city) => (
                    <Option key={city.code} value={city.code}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="barangay" label="Barangay" rules={[{ required: true, message: "Please select a barangay!" }]}>
            <Select placeholder="Select Barangay">
              {barangays.map((barangay) => (
                <Option key={barangay.code} value={barangay.code}>
                  {barangay.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: "Please enter first name!" }]}>
                <Input placeholder="Enter First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="middle_name" label="Middle Name">
                <Input placeholder="Enter Middle Name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: "Please enter last name!" }]}>
            <Input placeholder="Enter Last Name" />
          </Form.Item>

          <Form.Item name="course" label="Course" rules={[{ required: true, message: "Please enter course!" }]}>
            <Input placeholder="Enter Course" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}>
            <Input placeholder="Enter Email" />
          </Form.Item>

          <Form.Item name="contact_number" label="Contact Number" rules={[{ required: true, message: "Please enter contact number!" }]}>
            <Input placeholder="Enter Contact Number" />
          </Form.Item>

          <Form.Item name="birthdate" label="Birthdate" rules={[{ required: true, message: "Please select birthdate!" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="ambition" label="Ambition" rules={[{ required: true, message: "Please enter your ambition!" }]}>
            <Input.TextArea rows={4} placeholder="Enter Ambition" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default YearbookProfileForm;
