import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GridLayout from 'react-grid-layout';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, Typography, MenuItem, Select, Button, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [dataType, setDataType] = useState('energy');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/usage');
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const formatData = () => {
    const labels = data.map(d => new Date(d.date).toLocaleDateString());
    const usageData = data.filter(d => d.type === dataType).map(d => d.usage);

    return {
      labels,
      datasets: [
        {
          label: `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Usage`,
          data: usageData,
          borderColor: dataType === 'energy' ? 'rgba(75,192,192,1)' : 'rgba(192,75,75,1)',
          backgroundColor: dataType === 'energy' ? 'rgba(75,192,192,0.2)' : 'rgba(192,75,75,0.2)',
        },
      ],
    };
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleDataTypeChange = (event) => {
    setDataType(event.target.value);
  };

  const handleClearData = async () => {
    try {
      await axios.delete('http://localhost:3000/api/usage');
      setData([]);
      alert('Data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Community Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => navigate('/data-entry')}>
            Enter Data
          </Button>
        </Grid>
        <Grid item>
          <Select value={chartType} onChange={handleChartTypeChange}>
            <MenuItem value="line">Line Chart</MenuItem>
            <MenuItem value="bar">Bar Chart</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Select value={dataType} onChange={handleDataTypeChange}>
            <MenuItem value="energy">Energy</MenuItem>
            <MenuItem value="water">Water</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={handleClearData}>Clear Data</Button>
        </Grid>
      </Grid>
      <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
        <div key="chart" data-grid={{ x: 0, y: 0, w: 6, h: 8 }}>
          <Card>
            <CardContent>
              {chartType === 'line' ? (
                <Line data={formatData()} />
              ) : (
                <Bar data={formatData()} />
              )}
            </CardContent>
          </Card>
        </div>
      </GridLayout>
    </Container>
  );
};

export default Dashboard;
