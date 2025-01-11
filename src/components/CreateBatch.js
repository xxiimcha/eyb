import React, { useState } from 'react';
import './css/CreateBatch.css';

const CreateBatch = () => {
  const [batchYearRange, setBatchYearRange] = useState('');
  const [batchType, setBatchType] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Regular expression to validate the year range format (e.g., "2021-2022")
    const validYearFormat = /^\d{4}-\d{4}$/;

    // Valid batch types
    const validBatchTypes = ['Regular', 'Mid-Year'];

    if (!validYearFormat.test(batchYearRange)) {
      alert(
        "Invalid format for Academic Year Range. Please use the format '2021-2022' without spaces."
      );
      return;
    }

    if (!validBatchTypes.includes(batchType)) {
      alert("Invalid Batch Type. Only 'Regular' or 'Mid-Year' are allowed.");
      return;
    }

    const newBatch = {
      batch_year_range: batchYearRange,
      batch_type: batchType,
    };

    try {
      const response = await fetch('http://localhost:5000/api/create-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBatch),
      });

      if (response.status === 400) {
        alert('Batch already exists! Please try a different year or type.');
      } else if (response.ok) {
        alert('Batch created successfully!');
        // Optionally reset the form
        setBatchYearRange('');
        setBatchType('');
      } else {
        throw new Error('Failed to create batch');
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="create-page-container">
      <h2>Create New Batch Folder</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="sy">Academic Year Range (e.g., 2021-2022)</label>
        <input
          type="text"
          id="sy"
          value={batchYearRange}
          onChange={(e) => setBatchYearRange(e.target.value)}
          placeholder="Insert S.Y. range"
          required
        />
        <label htmlFor="type">Batch Type (Regular/Mid-Year)</label>
        <input
          type="text"
          id="type"
          value={batchType}
          onChange={(e) => setBatchType(e.target.value.trim())} // Trim any extra spaces
          placeholder="Batch Type"
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateBatch;
