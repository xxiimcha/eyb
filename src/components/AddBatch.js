import React, { useState } from 'react';
import { Form, Input, Radio, Button, Upload, Typography, Row, Col, Card, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './css/AddBatch.css';

const { Title } = Typography;

function AddBatch() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    course: '',
    schoolYear: '',
    email: '',
    contact: '',
    enrollmentType: 'Regular',
    image: null,
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      setFormData({ ...formData, image: info.file.originFileObj });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleSubmit = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    // Send the data to the backend
    fetch('http://localhost:5000/addUser', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        message.success('User profile added successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        message.error('Failed to add user profile.');
      });
  };

  return (
    <div className="add-page" style={{ padding: '20px', textAlign: 'center' }}>
      <Title level={2}>Create New Student Profile</Title>
      <Form
        layout="vertical"
        style={{ maxWidth: '600px', margin: '0 auto' }}
        onFinish={handleSubmit}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="First Name" required>
              <Input
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Middle Name">
              <Input
                placeholder="Enter Middle Name"
                value={formData.middleName}
                onChange={(e) => handleChange('middleName', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Last Name" required>
          <Input
            placeholder="Enter Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Course" required>
          <Input
            placeholder="Enter Course"
            value={formData.course}
            onChange={(e) => handleChange('course', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="School Year" required>
          <Input
            placeholder="Enter School Year"
            value={formData.schoolYear}
            onChange={(e) => handleChange('schoolYear', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Email" required>
          <Input
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Contact" required>
          <Input
            placeholder="Enter Contact Number"
            value={formData.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Enrollment Type">
          <Radio.Group
            onChange={(e) => handleChange('enrollmentType', e.target.value)}
            value={formData.enrollmentType}
          >
            <Radio value="Regular">Regular</Radio>
            <Radio value="Mid-Year">Mid-Year</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Insert Image">
          <Upload
            accept="image/*"
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
      {formData.image && (
        <Card
          style={{ marginTop: '20px', maxWidth: '300px', textAlign: 'center', margin: '0 auto' }}
          cover={<img alt="Profile Preview" src={URL.createObjectURL(formData.image)} />}
        >
          <p><strong>{`${formData.firstName} ${formData.lastName}`}</strong></p>
          <p>{formData.course}</p>
        </Card>
      )}
    </div>
  );
}

export default AddBatch;
