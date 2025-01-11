const express = require("express");
const mysql = require("mysql2");
const NodeRSA = require("node-rsa");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const db = require("./db");
const kmeans = require("ml-kmeans");
const skmeans = require('skmeans');
const crypto = require('crypto');
const bodyParser = require('body-parser');

// Enable CORS and JSON middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(bodyParser.json());

// Test Route
app.get("/api/test", (req, res) => {
  res.send("Backend is working and reachable!");
});

// Yearbook Page - Fetch alumni by batch
app.get('/api/yearbook-batch/:batchId', (req, res) => {
  const { batchId } = req.params;

  const query = `
    SELECT 
      yp.profile_id,
      CONCAT(yp.last_name, ', ', yp.first_name, ' ', IFNULL(yp.middle_name, '')) AS name,
      yp.course,
      yp.email,
      yp.contact_number AS contact,
      IFNULL(CONCAT(b.name, ', ', c.name, ', ', p.name, ', ', r.name), 'N/A') AS address,
      IFNULL(yp.birthdate, 'N/A') AS birthdate,
      yp.ambition,
      yb.batch_type
      FROM yearbookprofiles yp
      JOIN yearbookbatches yb ON yp.batch_id = yb.batch_id
      LEFT JOIN barangays b ON yp.barangay = b.barangay_id
      LEFT JOIN cities c ON yp.city_or_municipality = c.city_id
      LEFT JOIN provinces p ON yp.province = p.province_id
      LEFT JOIN regions r ON yp.region = r.region_id
      WHERE yb.batch_id = ?
      ORDER BY yb.batch_type, yp.last_name;
    `;

  db.query(query, [batchId], (error, results) => {
    if (error) {
      console.error("Error fetching alumni by batch:", error);
      return res.status(500).json({ error: "Failed to fetch alumni for the batch" });
    }

    if (results.length === 0) {
      console.log(`No records found for batch ID: ${batchId}`);
      return res.status(404).json({ error: "No alumni found for the specified batch" });
    }

    res.status(200).json(results);
  });
});

// Endpoint to fetch all yearbook batches
app.get('/api/yearbook-batches', (req, res) => {
  const query = `
    SELECT 
      batch_id,
      batch_year_range,
      batch_type 
    FROM yearbookbatches
    ORDER BY batch_year_range ASC;
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching batches:", error);
      return res.status(500).json({ error: "Failed to fetch yearbook batches" });
    }

    if (results.length === 0) {
      console.log("No batches found in the database");
      return res.status(404).json({ error: "No yearbook batches found" });
    }

    console.log("Yearbook Batches:", results); // Debug log to verify batch data
    res.status(200).json(results);
  });
});

// Add a new batch
app.post("/api/create-batch", (req, res) => {
  const { batch_year_range, batch_type } = req.body;

  // Validate batch_year_range format
  const validYearRange = /^\d{4}-\d{4}$/;
  if (!validYearRange.test(batch_year_range)) {
    return res.status(400).json({ error: "Invalid format for year range. Use 'YYYY-YYYY' without spaces." });
  }

  // Validate batch_type
  const validBatchTypes = ["Regular", "Mid-Year"];
  if (!validBatchTypes.includes(batch_type)) {
    return res.status(400).json({ error: "Invalid batch type. Use 'Regular' or 'Mid-Year'." });
  }

  // Check for duplicates
  const query = "SELECT * FROM yearbookbatches WHERE batch_year_range = ? AND batch_type = ?";
  db.query(query, [batch_year_range, batch_type], (error, results) => {
    if (error) {
      console.error("Error checking for duplicates:", error);
      return res.status(500).json({ error: "Server error during duplicate check" });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: "Batch already exists!" });
    }

    // Insert the batch if no duplicates
    const insertQuery = "INSERT INTO yearbookbatches (batch_year_range, batch_type) VALUES (?, ?)";
    db.query(insertQuery, [batch_year_range, batch_type], (insertError) => {
      if (insertError) {
        console.error("Error creating batch:", insertError);
        return res.status(500).json({ error: "Failed to create batch" });
      }
      res.status(201).json({ message: "Batch created successfully!" });
    });
  });
});

// Fetch all batches
app.get("/api/get-batches", (req, res) => {
  const query = "SELECT batch_id, batch_year_range, batch_type FROM yearbookbatches ORDER BY batch_year_range ASC";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching batches:", error);
      res.status(500).json({ error: "Failed to fetch batches" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Fetch all regions
app.get("/api/db-regions", (req, res) => {
  const query = "SELECT region_id AS id, name FROM regions ORDER BY name ASC";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ error: "Failed to fetch regions" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Fetch provinces by region ID
app.get("/api/db-provinces/:region_id", (req, res) => {
  const { region_id } = req.params;
  const query =
    "SELECT province_id AS id, name FROM provinces WHERE region_id = ? ORDER BY name ASC";
  db.query(query, [region_id], (error, results) => {
    if (error) {
      console.error("Error fetching provinces:", error);
      res.status(500).json({ error: "Failed to fetch provinces" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Fetch cities/municipalities by province ID
app.get("/api/db-cities/:province_id", (req, res) => {
  const { province_id } = req.params;
  const query =
    "SELECT city_id AS id, name FROM cities WHERE province_id = ? ORDER BY name ASC";
  db.query(query, [province_id], (error, results) => {
    if (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ error: "Failed to fetch cities" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Fetch barangays by city/municipality ID
app.get("/api/db-barangays/:city_id", (req, res) => {
  const { city_id } = req.params;
  const query =
    "SELECT barangay_id AS id, name FROM barangays WHERE city_id = ? ORDER BY name ASC";
  db.query(query, [city_id], (error, results) => {
    if (error) {
      console.error("Error fetching barangays:", error);
      res.status(500).json({ error: "Failed to fetch barangays" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Fetch all accounts for display in the Accounts section
app.get("/api/accounts", (req, res) => {
  const query = `
  SELECT 
    CONCAT(yp.last_name, ', ', yp.first_name, ' ', yp.middle_name) AS name, 
    u.public_key, 
    u.private_key
  FROM yearbookprofiles yp
  JOIN users u ON yp.user_id = u.user_id
  ORDER BY yp.last_name ASC;
`;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching accounts:", error);
      res.status(500).json({ error: "Failed to fetch accounts" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Fetch all profiles for the Records section
app.get("/api/records", (req, res) => {
  const query = `
  SELECT 
    CONCAT(yp.last_name, ', ', yp.first_name, ' ', yp.middle_name) AS name, 
    yp.course, 
    yb.batch_year_range AS year, 
    yp.email, 
    yp.contact_number AS contact, 
    CONCAT(b.name, ', ', c.name, ', ', p.name, ', ', r.name) AS address, 
    IFNULL(DATE_FORMAT(yp.birthdate, '%d/%m/%Y'), 'N/A') AS birthdate, 
    yp.ambition
  FROM yearbookprofiles yp
  LEFT JOIN yearbookbatches yb ON yp.batch_id = yb.batch_id
  LEFT JOIN regions r ON yp.region = r.region_id
  LEFT JOIN provinces p ON yp.province = p.province_id
  LEFT JOIN cities c ON yp.city_or_municipality = c.city_id
  LEFT JOIN barangays b ON yp.barangay = b.barangay_id
  ORDER BY yp.last_name ASC;
`;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching records:", error);
      res.status(500).json({ error: "Failed to fetch records" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Add a new yearbook profile and automatically create a user account
app.post("/api/yearbook-profiles", async (req, res) => {
  const {
    batch_id,
    first_name,
    middle_name,
    last_name,
    course,
    email,
    contact_number,
    region,
    province,
    city_or_municipality,
    barangay,
    birthdate,
    ambition,
    profile_photo,
  } = req.body;

  try {
    // Generate RSA keys
    const key = new NodeRSA({ b: 512 });
    const privateKey = key.exportKey("private");
    const publicKey = key.exportKey("public").replace(/(-----.*-----|\s)/g, "");
    const hashedPassword = await bcrypt.hash(privateKey, 10);

    // Insert into Users table
    const userQuery =
      "INSERT INTO Users (public_key, private_key) VALUES (?, ?)";
    db.query(userQuery, [publicKey, hashedPassword], (userError, userResults) => {
      if (userError) {
        console.error("Error creating user account:", userError);
        return res.status(500).json({ error: "Failed to create user account" });
      }

      const userId = userResults.insertId;

      // Insert into YearbookProfiles table
      const profileQuery = `
        INSERT INTO YearbookProfiles 
        (user_id, batch_id, first_name, middle_name, last_name, course, email, contact_number, region, province, city_or_municipality, barangay, birthdate, ambition, profile_photo, public_key)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        profileQuery,
        [
          userId,
          batch_id,
          first_name,
          middle_name,
          last_name,
          course,
          email,
          contact_number,
          region,
          province,
          city_or_municipality,
          barangay,
          birthdate,
          ambition,
          profile_photo,
          publicKey,
        ],
        (profileError, profileResults) => {
          if (profileError) {
            console.error("Error adding profile:", profileError);
            return res.status(500).json({ error: "Failed to add profile" });
          }
          res.status(201).json({
            message: "Profile and user account created successfully",
            profileId: profileResults.insertId,
            publicKey,
            privateKey,
          });
        }
      );
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/// Get all profiles for Edit profile section
app.get('/profiles', (req, res) => {
  const query = 'SELECT * FROM yearbookprofiles';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get a specific profile by ID
app.get('/profiles/:profile_id', (req, res) => {
  const { profile_id } = req.params;
  const query = 'SELECT * FROM yearbookprofiles WHERE profile_id = ?';
  db.query(query, [profile_id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Profile not found.' });
    }
  });
});

// Update a profile
app.put('/profiles/:profile_id', (req, res) => {
  const { profile_id } = req.params;
  const { first_name, middle_name, last_name, course, email, contact_number, birthdate, ambition } = req.body;
  const query = `
    UPDATE yearbookprofiles 
    SET first_name = ?, middle_name = ?, last_name = ?, course = ?, email = ?, contact_number = ?, birthdate = ?, ambition = ? 
    WHERE profile_id = ?
  `;
  db.query(query, [first_name, middle_name, last_name, course, email, contact_number, birthdate, ambition, profile_id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Profile updated successfully.' });
  });
});

// Delete a profile
app.delete('/profiles/:profile_id', (req, res) => {
  const { profile_id } = req.params;

  const query = 'DELETE FROM yearbookprofiles WHERE profile_id = ?';
  // add query for delete users table
  
  db.query(query, [profile_id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Profile deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Profile not found.' });
    }
  });
});

// Fetch analytics data
app.get("/api/analytics", (req, res) => {
  const queries = {
    graduatesByYear: `
      SELECT yb.batch_year_range AS year, COUNT(*) AS count
      FROM yearbookprofiles yp
      LEFT JOIN yearbookbatches yb ON yp.batch_id = yb.batch_id
      GROUP BY yb.batch_year_range
      ORDER BY yb.batch_year_range;
    `,
    graduatesByCourse: `
      SELECT course, COUNT(*) AS count
      FROM yearbookprofiles
      GROUP BY course
      ORDER BY course;
    `
  };

  const results = {};

  db.query(queries.graduatesByYear, (error, yearData) => {
    if (error) {
      console.error("Error fetching graduates by year:", error);
      res.status(500).json({ error: "Error fetching graduates by year" });
      return;
    }

    results.graduatesByYear = yearData;

    db.query(queries.graduatesByCourse, (error, courseData) => {
      if (error) {
        console.error("Error fetching graduates by course:", error);
        res.status(500).json({ error: "Error fetching graduates by course" });
        return;
      }

      results.graduatesByCourse = courseData;

      res.status(200).json(results);
    });
  });
});

// Promisify db.query
const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params || [], (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

app.get("/api/clustering-graduates-by-batch", async (req, res) => {
  const query = `
    SELECT batch_year_range AS batch_year, COUNT(*) AS graduate_count
    FROM yearbookprofiles yp
    LEFT JOIN yearbookbatches yb ON yp.batch_id = yb.batch_id
    GROUP BY batch_year_range;
  `;

  try {
    // Use the promisified query function
    const results = await queryAsync(query);

    // Prepare data for clustering
    //const dataset = results.map((row) => [row.graduate_count]); // 2D array for k-means input
    const dataset = results.map((row) => row.graduate_count); // 1D arraz for skmeans
    const batchLabels = results.map((row) => row.batch_year);

    // Perform k-means clustering with 3 clusters
    const numberOfClusters = 3;
    const clusteringResult = skmeans(dataset, numberOfClusters);
    
    const clusters = clusteringResult.idxs;
    const centroids = clusteringResult.centroids;

    // Prepare response with cluster assignments
    const response = {
      clusters: [...new Set(clusters)], // Unique cluster indices
      centroids,
      data: results.map((row, index) => ({
        batch_year: batchLabels[index],
        graduate_count: row.graduate_count,
        cluster: clusters[index], // Cluster assignment for this data point
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error during k-means clustering:", error);
    res.status(500).json({ error: "Clustering failed" });
  }
});

// Endpoint to get batch details including users in the same batch
app.post('/api/getBatch', (req, res) => {
  const { privateKey } = req.body;
  
  if (!privateKey) {
    return res.status(400).json({ message: 'Private key is required' });
  }

  const query = `
    SELECT 
      b.batch_id, 
      b.batch_type, 
      b.batch_year_range, 
      p.first_name, 
      p.middle_name, 
      p.last_name, 
      p.ambition
    FROM yearbookprofiles p
    JOIN yearbookbatches b ON p.batch_id = b.batch_id
    WHERE p.batch_id = (
      SELECT p2.batch_id
      FROM users u
      JOIN yearbookprofiles p2 ON u.user_id = p2.user_id
      WHERE u.private_key = ?
    )
  `;

  db.query(query, [privateKey], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database query failed', error: err.message });
    }

    if (results.length > 0) {
      // Extract the batch details
      const batchDetails = {
        batch_id: results[0].batch_id,
        batch_type: results[0].batch_type,
        batch_year_range: results[0].batch_year_range,
        users: results.map(result => ({
          first_name: result.first_name,
          middle_name: result.middle_name,
          last_name: result.last_name,
          ambition: result.ambition
          // add birthday
        }))
      };

      res.json(batchDetails);
    } else {
      res.status(404).json({ message: 'No matching batch found' });
    }
  });
});



// Server init
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
