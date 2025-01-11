const kmeans = require("ml-kmeans");

const dataset = [[1], [2], [3], [10], [11], [12]]; // Example dataset
const numberOfClusters = 2;

try {
    const clustering = kmeans(dataset, numberOfClusters);
    console.log("Clusters:", clustering.clusters);
    console.log("Centroids:", clustering.centroids);
} catch (error) {
    console.error("Error during k-means clustering:", error);
}
