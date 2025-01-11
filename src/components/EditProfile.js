import React, { useState, useEffect } from "react";
import axios from "axios";

function EditProfile() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [graduationYears, setGraduationYears] = useState([]);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [formData, setFormData] = useState({
    batch_id: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    course: "",
    email: "",
    contact_number: "",
    birthdate: "",
    ambition: "",
  });

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get("http://localhost:5000/api/records");
        const yearResponse = await axios.get("http://localhost:5000/api/yearbook-graduation-ranges");
        const regionResponse = await axios.get("http://localhost:5000/api/db-regions");

        setProfiles(profileResponse.data);
        setFilteredProfiles(profileResponse.data);
        setGraduationYears(yearResponse.data);
        setRegions(regionResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = profiles.filter((profile) =>
      profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProfiles(filtered);
  };

  const handleSelectProfile = async (profile) => {
    setSelectedProfile(profile);

    setFormData({
      batch_id: profile.batch_id || "",
      region: profile.region || "",
      province: profile.province || "",
      city: profile.city_or_municipality || "",
      barangay: profile.barangay || "",
      first_name: profile.first_name || "",
      middle_name: profile.middle_name || "",
      last_name: profile.last_name || "",
      course: profile.course || "",
      email: profile.email || "",
      contact_number: profile.contact_number || "",
      birthdate: profile.birthdate || "",
      ambition: profile.ambition || "",
    });

    // Fetch dropdown dependencies dynamically
    if (profile.region) await fetchProvinces(profile.region);
    if (profile.province) await fetchCities(profile.province);
    if (profile.city_or_municipality) await fetchBarangays(profile.city_or_municipality);
  };

  const fetchProvinces = async (regionId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/db-provinces/${regionId}`);
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/db-cities/${provinceId}`);
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchBarangays = async (cityId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/db-barangays/${cityId}`);
      setBarangays(response.data);
    } catch (error) {
      console.error("Error fetching barangays:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditSubmit = async () => {
    if (!selectedProfile || !selectedProfile.profile_id) {
      alert("Please select a profile to edit.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/edit-profile/${selectedProfile.profile_id}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        alert("Profile updated successfully!");
        const profileResponse = await axios.get("http://localhost:5000/api/records");
        setProfiles(profileResponse.data);
        setFilteredProfiles(profileResponse.data);
        setSelectedProfile(null);
        setFormData({
          batch_id: "",
          region: "",
          province: "",
          city: "",
          barangay: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          course: "",
          email: "",
          contact_number: "",
          birthdate: "",
          ambition: "",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Year</th>
            <th>Email</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfiles.map((profile) => (
            <tr
              key={profile.profile_id}
              onClick={() => handleSelectProfile(profile)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectedProfile?.profile_id === profile.profile_id ? "#f0f0f0" : "transparent",
              }}
            >
              <td>{profile.first_name} {profile.last_name}</td>
              <td>{profile.course}</td>
              <td>{profile.batch_id}</td>
              <td>{profile.email}</td>
              <td>{profile.contact_number}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProfile && (
        <form>
          <select
            name="batch_id"
            value={formData.batch_id}
            onChange={handleInputChange}
          >
            <option value="">Select Batch</option>
            {graduationYears.map((year) => (
              <option key={year.batch_id} value={year.batch_id}>
                {year.batch_year_range}
              </option>
            ))}
          </select>
          <select
            name="region"
            value={formData.region}
            onChange={(e) => {
              handleInputChange(e);
              fetchProvinces(e.target.value);
            }}
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
          <select
            name="province"
            value={formData.province}
            onChange={(e) => {
              handleInputChange(e);
              fetchCities(e.target.value);
            }}
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
          <select
            name="city"
            value={formData.city}
            onChange={(e) => {
              handleInputChange(e);
              fetchBarangays(e.target.value);
            }}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <select
            name="barangay"
            value={formData.barangay}
            onChange={handleInputChange}
          >
            <option value="">Select Barangay</option>
            {barangays.map((barangay) => (
              <option key={barangay.id} value={barangay.id}>
                {barangay.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="middle_name"
            value={formData.middle_name}
            onChange={handleInputChange}
            placeholder="Middle Name"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            placeholder="Last Name"
          />
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            placeholder="Course"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            placeholder="Contact"
          />
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleInputChange}
            placeholder="Birthdate"
          />
          <textarea
            name="ambition"
            value={formData.ambition}
            onChange={handleInputChange}
            placeholder="Ambition"
          ></textarea>
          <button type="button" onClick={handleEditSubmit}>
            Edit
          </button>
        </form>
      )}
    </div>
  );
}

export default EditProfile;
