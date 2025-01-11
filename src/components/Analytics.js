import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  BarController,
  BarElement,
  ScatterController,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, Row, Col, Spin, Typography, Alert } from "antd";

// Register Chart.js components
Chart.register(
  BarController,
  BarElement,
  ScatterController,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle, Text } = Typography;

const Analytics = () => {
  // Refs for chart instances and canvases
  const barChartRef = useRef(null);
  const scatterChartRef = useRef(null);
  const barChartInstanceRef = useRef(null);
  const scatterChartInstanceRef = useRef(null);

  // State variables for data fetching and error handling
  const [dataFetched, setDataFetched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/analytics");
        const data = await response.json();

        const clusteringResponse = await fetch(
          "http://localhost:5000/api/clustering-graduates-by-batch"
        );
        const clusteringData = await clusteringResponse.json();

        if (response.ok && clusteringResponse.ok) {
          const combinedData = {
            ...data,
            clusters: clusteringData.clusters,
            data: clusteringData.data,
          };

          renderCharts(combinedData);
          setDataFetched(true);
        } else {
          setErrorMessage("Failed to load data. Please try again later.");
        }
      } catch (error) {
        setErrorMessage(
          "Unable to connect to the server. Please check your backend."
        );
      }
    };

    const renderCharts = (data) => {
      const barCtx = barChartRef.current.getContext("2d");
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      barChartInstanceRef.current = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: data.graduatesByYear.map((item) => item.year),
          datasets: [
            {
              label: "Graduates by Year",
              data: data.graduatesByYear.map((item) => item.count),
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Graduates by Year",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Year",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Graduates",
              },
            },
          },
        },
      });

      const uniqueClusters = [...new Set(data.data.map((item) => item.cluster))];
      uniqueClusters.sort((a, b) => a - b);

      const scatterCtx = scatterChartRef.current.getContext("2d");
      if (scatterChartInstanceRef.current) {
        scatterChartInstanceRef.current.destroy();
      }
      scatterChartInstanceRef.current = new Chart(scatterCtx, {
        type: "scatter",
        data: {
          datasets: uniqueClusters.map((clusterIndex, index) => ({
            label: `Cluster ${clusterIndex + 1}`,
            data: data.data
              .filter((item) => item.cluster === clusterIndex)
              .map((item) => ({
                x: parseInt(item.batch_year.split("-")[0]),
                y: item.graduate_count,
              })),
            backgroundColor: `rgba(${(index * 50) % 255}, ${
              (index * 100) % 255
            }, ${(index * 150) % 255}, 0.6)`,
          })),
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Graduates by Batch-Year (Clusters)",
            },
          },
          scales: {
            x: {
              type: "linear",
              title: {
                display: true,
                text: "Batch Year",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Graduates",
              },
            },
          },
        },
      });
    };

    fetchData();

    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      if (scatterChartInstanceRef.current) {
        scatterChartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="analytics-container">
      <AntTitle level={1}>Analytics Dashboard</AntTitle>

      {errorMessage && <Alert message={errorMessage} type="error" showIcon />}

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Graduates by Year">
            {dataFetched ? (
              <canvas ref={barChartRef} id="barChart"></canvas>
            ) : (
              <Spin tip="Loading data..." />
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Graduates by Batch-Year (Clusters)">
            {dataFetched ? (
              <canvas ref={scatterChartRef} id="scatterChart"></canvas>
            ) : (
              <Spin tip="Loading data..." />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
