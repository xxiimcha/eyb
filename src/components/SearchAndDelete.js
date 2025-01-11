import React, { useState } from "react";
import axios from "axios";

function SearchAndDelete() {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [message, setMessage] = useState("");

  // Search for profiles by name
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/records`);
      const filteredProfiles = response.data.filter((profile) =>
        `${profile.first_name} ${profile.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setProfiles(filteredProfiles);
      setMessage(filteredProfiles.length ? "" : "No profiles found");
    } catch (error) {
      setProfiles([]);
      setMessage("Error searching profiles. Please try again.");
      console.error("Error fetching records:", error);
    }
  };

  // Handle selecting a profile for deletion
  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    setMessage("");
  };

  // Delete selected profile
  const handleDelete = async () => {
    if (selectedProfile && selectedProfile.profile_id) {
      try {
        await axios.delete(
          `http://localhost:5000/api/delete-profile/${selectedProfile.profile_id}`
        );
        setMessage("Profile deleted successfully");
        setProfiles(profiles.filter((p) => p.profile_id !== selectedProfile.profile_id));
        setSelectedProfile(null);
      } catch (error) {
        setMessage("Error deleting profile. Please try again.");
        console.error("Error deleting profile:", error);
      }
    }
  };

  return (
    <div>
      <h2>Search and Delete Yearbook Profile</h2>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {message && <p>{message}</p>}

      {profiles.length > 0 && (
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
            {profiles.map((profile) => (
              <tr
                key={profile.profile_id}
                onClick={() => handleSelectProfile(profile)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedProfile?.profile_id === profile.profile_id
                      ? "#f0f0f0"
                      : "transparent",
                }}
              >
                <td>{`${profile.first_name} ${profile.last_name}`}</td>
                <td>{profile.course}</td>
                <td>{profile.batch_year_range}</td>
                <td>{profile.email}</td>
                <td>{profile.contact_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedProfile && (
        <div>
          <h3>Selected Profile</h3>
          <p>Name: {`${selectedProfile.first_name} ${selectedProfile.last_name}`}</p>
          <p>Course: {selectedProfile.course}</p>
          <p>Year: {selectedProfile.batch_year_range}</p>
          <p>Email: {selectedProfile.email}</p>
          <p>Contact: {selectedProfile.contact_number}</p>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default SearchAndDelete;
