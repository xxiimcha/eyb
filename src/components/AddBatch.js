import React, { useState } from 'react';
import './css/AddBatch.css';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
  data.append('firstName', formData.firstName);
  data.append('middleName', formData.middleName);
  data.append('lastName', formData.lastName);
  data.append('course', formData.course);
  data.append('schoolYear', formData.schoolYear);
  data.append('email', formData.email);
  data.append('contact', formData.contact);
  data.append('enrollmentType', formData.enrollmentType);
  data.append('image', formData.image);

  // Send the data to the backend
  fetch('http://localhost:5000/addUser', {
    method: 'POST',
    body: data,
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
};

  return (
    <div className="add-page">
      <h2>Create New Student Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
        <label>
          Middle Name:
          <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>
        <label>
          Course:
          <input type="text" name="course" value={formData.course} onChange={handleChange} required />
        </label>
        <label>
          School Year:
          <input type="text" name="schoolYear" value={formData.schoolYear} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Contact:
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
        </label>
        <div className="radio-group">
          <label>
            <input type="radio" name="enrollmentType" value="Regular" checked={formData.enrollmentType === 'Regular'} onChange={handleChange} />
            Regular
          </label>
          <label>
            <input type="radio" name="enrollmentType" value="Mid-Year" checked={formData.enrollmentType === 'Mid-Year'} onChange={handleChange} />
            Mid-Year
          </label>
        </div>
        <label className="image-upload">
          Insert Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <button type="submit">Add</button>
      </form>
      {formData.image && (
        <div className="preview">
          <img src={URL.createObjectURL(formData.image)} alt="Profile Preview" />
          <p>{`${formData.firstName} ${formData.lastName}`}</p>
          <p>{formData.course}</p>
        </div>
      )}
    </div>
  );
}

export default AddBatch;