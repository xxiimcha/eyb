const MAX_ITERATIONS = 50;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function calcMeanCentroid(dataSet, start, end) {
  const features = dataSet[0].length;
  const n = end - start;
  let mean = [];
  for (let i = 0; i < features; i++) {
    mean.push(0);
  }
  for (let i = start; i < end; i++) {
    for (let j = 0; j < features; j++) {
      mean[j] += dataSet[i][j] / n;
    }
  }
  return mean;
}

function getRandomCentroidsNaiveSharding(dataset, k) {
  const numSamples = dataset.length;
  const step = Math.floor(numSamples / k);
  const centroids = [];
  for (let i = 0; i < k; i++) {
    const start = step * i;
    let end = step * (i + 1);
    if (i + 1 === k) {
      end = numSamples;
    }
    centroids.push(calcMeanCentroid(dataset, start, end));
  }
  return centroids;
}

function getRandomCentroids(dataset, k) {
  const numSamples = dataset.length;
  const centroidsIndex = [];
  while (centroidsIndex.length < k) {
    const index = randomBetween(0, numSamples);
    if (!centroidsIndex.includes(index)) {
      centroidsIndex.push(index);
    }
  }
  return centroidsIndex.map((index) => [...dataset[index]]);
}

function compareCentroids(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function shouldStop(oldCentroids, centroids, iterations) {
  if (iterations > MAX_ITERATIONS) {
    return true;
  }
  if (!oldCentroids || !oldCentroids.length) {
    return false;
  }
  for (let i = 0; i < centroids.length; i++) {
    if (!compareCentroids(centroids[i], oldCentroids[i])) {
      return false;
    }
  }
  return true;
}

function getDistanceSQ(a, b) {
  return a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0);
}

function getLabels(dataSet, centroids) {
  const labels = {};
  for (let c = 0; c < centroids.length; c++) {
    labels[c] = {
      points: [],
      centroid: centroids[c],
    };
  }
  for (let i = 0; i < dataSet.length; i++) {
    const a = dataSet[i];
    let closestCentroidIndex = 0;
    let closestDistance = getDistanceSQ(a, centroids[0]);
    for (let j = 1; j < centroids.length; j++) {
      const distance = getDistanceSQ(a, centroids[j]);
      if (distance < closestDistance) {
        closestCentroidIndex = j;
        closestDistance = distance;
      }
    }
    labels[closestCentroidIndex].points.push(a);
  }
  return labels;
}

function getPointsMean(pointList) {
  const totalPoints = pointList.length;
  const means = Array(pointList[0].length).fill(0);
  for (let point of pointList) {
    for (let j = 0; j < point.length; j++) {
      means[j] += point[j] / totalPoints;
    }
  }
  return means;
}

function recalculateCentroids(dataSet, labels, k) {
  const newCentroids = [];
  for (let clusterIndex in labels) {
    const cluster = labels[clusterIndex];
    if (cluster.points.length > 0) {
      newCentroids.push(getPointsMean(cluster.points));
    } else {
      newCentroids.push(getRandomCentroids(dataSet, 1)[0]);
    }
  }
  return newCentroids;
}

function kmeans(dataset, k, useNaiveSharding = true) {
  if (!dataset.length || dataset[0].length === 0 || dataset.length <= k) {
    throw new Error("Invalid dataset");
  }

  let iterations = 0;
  let oldCentroids = null;
  let centroids = useNaiveSharding
    ? getRandomCentroidsNaiveSharding(dataset, k)
    : getRandomCentroids(dataset, k);

  while (!shouldStop(oldCentroids, centroids, iterations)) {
    oldCentroids = centroids;
    iterations++;

    const labels = getLabels(dataset, centroids);
    centroids = recalculateCentroids(dataset, labels, k);
  }

  const clusters = Object.keys(getLabels(dataset, centroids)).map(
    (key) => getLabels(dataset, centroids)[key]
  );

  return {
    clusters: clusters,
    centroids: centroids,
    iterations: iterations,
    converged: iterations <= MAX_ITERATIONS,
  };
}

export default kmeans;
