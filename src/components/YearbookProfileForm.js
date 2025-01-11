import React, { useState, useEffect } from "react";
import './css/YearbookProfileForm.css';

function YearbookProfileForm() {
  const [batches, setBatches] = useState([]); // State for batches
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [formData, setFormData] = useState({
    batchId: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    firstName: "",
    middleName: "",
    lastName: "",
    course: "",
    email: "",
    contactNumber: "",
    birthdate: "",
    ambition: "",
  });

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

  // Fetch Provinces by Region
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

  // Fetch Cities by Province
  const fetchCities = (provinceId) => {
    fetch(`http://localhost:5000/api/db-cities/${provinceId}`)
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
        setBarangays([]);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  };

  // Fetch Barangays by City
  const fetchBarangays = (cityId) => {
    fetch(`http://localhost:5000/api/db-barangays/${cityId}`)
      .then((response) => response.json())
      .then((data) => setBarangays(data))
      .catch((error) => console.error("Error fetching barangays:", error));
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit Form Data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/yearbook-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batch_id: formData.batchId,
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.lastName,
          course: formData.course,
          email: formData.email,
          contact_number: formData.contactNumber,
          region: formData.region,
          province: formData.province,
          city_or_municipality: formData.city,
          barangay: formData.barangay,
          birthdate: formData.birthdate,
          ambition: formData.ambition,
          profile_photo: null, // Placeholder for photo logic
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Profile added successfully!");
        console.log("Response Data:", result);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
        console.error("Error Response:", error);
      }
    } catch (error) {
      alert("An error occurred while submitting the form.");
      console.error("Submission Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Batch Dropdown */}
      <label>Batch:</label>
      <select
        name="batchId"
        value={formData.batchId}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Batch</option>
        {batches.map((batch) => (
          <option key={batch.batch_id} value={batch.batch_id}>
            {batch.batch_year_range} ({batch.batch_type})
          </option>
        ))}
      </select>

      {/* Existing Fields */}
      <label>Region:</label>
      <select
        name="region"
        value={formData.region}
        onChange={(e) => {
          handleInputChange(e);
          fetchProvinces(e.target.value);
        }}
        required
      >
        <option value="">Select Region</option>
        {regions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>

      <label>Province:</label>
      <select
        name="province"
        value={formData.province}
        onChange={(e) => {
          handleInputChange(e);
          fetchCities(e.target.value);
        }}
        required
      >
        <option value="">Select Province</option>
        {provinces.map((province) => (
          <option key={province.id} value={province.id}>
            {province.name}
          </option>
        ))}
      </select>

      <label>City:</label>
      <select
        name="city"
        value={formData.city}
        onChange={(e) => {
          handleInputChange(e);
          fetchBarangays(e.target.value);
        }}
        required
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      <label>Barangay:</label>
      <select
        name="barangay"
        value={formData.barangay}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Barangay</option>
        {barangays.map((barangay) => (
          <option key={barangay.id} value={barangay.id}>
            {barangay.name}
          </option>
        ))}
      </select>

      {/* Additional Fields */}
      <label>First Name:</label>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        required
      />

      <label>Middle Name:</label>
      <input
        type="text"
        name="middleName"
        value={formData.middleName}
        onChange={handleInputChange}
        required
      />

      <label>Last Name:</label>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        required
      />

      <label>Course:</label>
      <input
        type="text"
        name="course"
        value={formData.course}
        onChange={handleInputChange}
        required
      />

      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />

      <label>Contact Number:</label>
      <input
        type="number"
        minlength={11}
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleInputChange}
        required
      />

      <label>Birthdate:</label>
      <input
        type="date"
        name="birthdate"
        value={formData.birthdate}
        onChange={handleInputChange}
        required
      />

      <label>Ambition:</label>
      <textarea
        name="ambition"
        value={formData.ambition}
        onChange={handleInputChange}
        required
      ></textarea>

      <button type="submit">Submit</button>
    </form>
  );
}

export default YearbookProfileForm;
