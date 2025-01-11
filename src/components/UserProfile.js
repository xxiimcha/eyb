import React, { useState, useEffect } from "react";
import axios from "axios";

function UserProfile({ profileId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch profile data when component mounts
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/${profileId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (profileId) fetchProfile();
  }, [profileId]);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h2>{profile.first_name} {profile.last_name}'s Profile</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Course:</strong> {profile.course}</p>
      <p><strong>Batch:</strong> {profile.batch_id}</p>
      <p><strong>Region:</strong> {profile.region}</p>
      <p><strong>Province:</strong> {profile.province}</p>
      <p><strong>City:</strong> {profile.city_or_municipality}</p>
      <p><strong>Barangay:</strong> {profile.barangay}</p>
      <p><strong>Contact Number:</strong> {profile.contact_number}</p>
      <p><strong>Ambition:</strong> {profile.ambition}</p>
    </div>
  );
}

export default UserProfile;
