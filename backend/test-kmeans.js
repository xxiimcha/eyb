const kmeans = require("ml-kmeans");

const dataset = [[1], [2], [3], [10], [11], [12]]; // Example data
const numberOfClusters = 2;

try {
    const { clusters, centroids } = kmeans(dataset, numberOfClusters);
    console.log("Clusters:", clusters);
    console.log("Centroids:", centroids);
} catch (error) {
    console.error("Error during k-means clustering:", error);
}
