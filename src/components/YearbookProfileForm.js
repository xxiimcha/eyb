import React, { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker, Button, Row, Col, message } from "antd";
import './css/YearbookProfileForm.css';

const { Option } = Select;
const { TextArea } = Input;

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
    fetch("http://localhost:5000/api/db-regions")
      .then((response) => response.json())
      .then((data) => setRegions(data))
      .catch((error) => console.error("Error fetching regions:", error));
  }, []);

  const fetchProvinces = (regionId) => {
    fetch(`http://localhost:5000/api/db-provinces/${regionId}`)
      .then((response) => response.json())
      .then((data) => {
        setProvinces(data);
        setCities([]);
        setBarangays([]);
      })
      .catch((error) => console.error("Error fetching provinces:", error));
  };

  const fetchCities = (provinceId) => {
    fetch(`http://localhost:5000/api/db-cities/${provinceId}`)
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
        setBarangays([]);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  };

  const fetchBarangays = (cityId) => {
    fetch(`http://localhost:5000/api/db-barangays/${cityId}`)
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
          batch_id: values.batchId,
          first_name: values.firstName,
          middle_name: values.middleName,
          last_name: values.lastName,
          course: values.course,
          email: values.email,
          contact_number: values.contactNumber,
          region: values.region,
          province: values.province,
          city_or_municipality: values.city,
          barangay: values.barangay,
          birthdate: values.birthdate.format("YYYY-MM-DD"),
          ambition: values.ambition,
          profile_photo: null, // Placeholder for photo logic
        }),
      });

      if (response.ok) {
        const result = await response.json();
        message.success("Profile added successfully!");
        form.resetFields();
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
    <Row justify="center" style={{ marginTop: "20px" }}>
      <Col xs={24} sm={20} md={16} lg={12}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        >
          <Form.Item name="batchId" label="Batch" rules={[{ required: true, message: "Please select a batch!" }]}>
            <Select placeholder="Select Batch">
              {batches.map((batch) => (
                <Option key={batch.batch_id} value={batch.batch_id}>
                  {batch.batch_year_range} ({batch.batch_type})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="region" label="Region" rules={[{ required: true, message: "Please select a region!" }]}>
            <Select
              placeholder="Select Region"
              onChange={(value) => {
                form.setFieldsValue({ province: null, city: null, barangay: null });
                fetchProvinces(value);
              }}
            >
              {regions.map((region) => (
                <Option key={region.id} value={region.id}>
                  {region.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="province" label="Province" rules={[{ required: true, message: "Please select a province!" }]}>
            <Select
              placeholder="Select Province"
              onChange={(value) => {
                form.setFieldsValue({ city: null, barangay: null });
                fetchCities(value);
              }}
            >
              {provinces.map((province) => (
                <Option key={province.id} value={province.id}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="city" label="City" rules={[{ required: true, message: "Please select a city!" }]}>
            <Select
              placeholder="Select City"
              onChange={(value) => {
                form.setFieldsValue({ barangay: null });
                fetchBarangays(value);
              }}
            >
              {cities.map((city) => (
                <Option key={city.id} value={city.id}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="barangay" label="Barangay" rules={[{ required: true, message: "Please select a barangay!" }]}>
            <Select placeholder="Select Barangay">
              {barangays.map((barangay) => (
                <Option key={barangay.id} value={barangay.id}>
                  {barangay.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "Please enter your first name!" }]}>
            <Input placeholder="Enter First Name" />
          </Form.Item>

          <Form.Item name="middleName" label="Middle Name" rules={[{ required: true, message: "Please enter your middle name!" }]}>
            <Input placeholder="Enter Middle Name" />
          </Form.Item>

          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Please enter your last name!" }]}>
            <Input placeholder="Enter Last Name" />
          </Form.Item>

          <Form.Item name="course" label="Course" rules={[{ required: true, message: "Please enter your course!" }]}>
            <Input placeholder="Enter Course" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}>
            <Input placeholder="Enter Email" />
          </Form.Item>

          <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true, message: "Please enter your contact number!" }]}>
            <Input placeholder="Enter Contact Number" type="number" />
          </Form.Item>

          <Form.Item name="birthdate" label="Birthdate" rules={[{ required: true, message: "Please select your birthdate!" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="ambition" label="Ambition" rules={[{ required: true, message: "Please enter your ambition!" }]}>
            <TextArea placeholder="Enter Ambition" rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

export default YearbookProfileForm;
