import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/Records.css"; // Ensure the updated CSS file is linked

function Records() {
  const [profiles, setProfiles] = useState([]);

  // Fetch profiles on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/records");
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="records-container">
      <h2>Records</h2>
      <table className="records-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Year</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Birthdate</th>
            <th>Ambition</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.profile_id}>
              <td>{profile.name}</td>
              <td>{profile.course}</td>
              <td>{profile.year}</td>
              <td>{profile.email}</td>
              <td>{profile.contact}</td>
              <td>{profile.address}</td>
              <td>{profile.birthdate || "N/A"}</td>
              <td>{profile.ambition || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Records;
