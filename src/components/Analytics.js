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
import { Row, Col, Card, Typography, Spin } from "antd";
import "./Analytics.css";

const { Title: AntTitle } = Typography;

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

const Analytics = () => {
  const barChartRef = useRef(null);
  const scatterChartRef = useRef(null);
  const barChartInstanceRef = useRef(null);
  const scatterChartInstanceRef = useRef(null);

  const [dataFetched, setDataFetched] = useState(false);

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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
            backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.6)`,
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

      <Spin spinning={!dataFetched} size="large">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Graduates by Year" bordered={false}>
              <canvas ref={barChartRef} id="barChart"></canvas>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Graduates by Batch-Year (Clusters)" bordered={false}>
              <canvas ref={scatterChartRef} id="scatterChart"></canvas>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Analytics;
