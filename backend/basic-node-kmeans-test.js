const kmeans = require("node-kmeans");

const data = [
    { id: 1, vector: [1] },
    { id: 2, vector: [2] },
    { id: 3, vector: [3] },
    { id: 4, vector: [10] },
    { id: 5, vector: [11] },
    { id: 6, vector: [12] },
];

kmeans.clusterize(data, { k: 2 }, (err, res) => {
    if (err) {
        console.error("Error during k-means clustering:", err);
    } else {
        console.log("Clusters:", res);
    }
});
