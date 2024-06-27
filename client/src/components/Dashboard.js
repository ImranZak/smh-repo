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
import { Card, CardContent, Typography, MenuItem, Select, Button, Grid, Container, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  const [charts, setCharts] = useState([]);
  const [layout, setLayout] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');
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

  const formatData = (dataType) => {
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

  const handleChartTypeChange = (event, index) => {
    const newCharts = [...charts];
    newCharts[index].chartType = event.target.value;
    setCharts(newCharts);
  };

  const handleDataTypeChange = (event, index) => {
    const newCharts = [...charts];
    newCharts[index].dataType = event.target.value;
    setCharts(newCharts);
  };

  const handleAddChart = () => {
    const newLayout = [...layout, { i: `chart-${charts.length}`, x: 0, y: 0, w: isMobile ? 12 : 6, h: 8 }];
    setLayout(newLayout);
    setCharts([...charts, { chartType: 'line', dataType: 'energy' }]);
  };

  const handleRemoveChart = (index) => {
    const newCharts = charts.filter((_, i) => i !== index);
    const newLayout = layout.filter((item) => item.i !== `chart-${index}`);
    setCharts(newCharts);
    setLayout(newLayout);
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

  const handleSaveLayout = () => {
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    localStorage.setItem('dashboardCharts', JSON.stringify(charts));
    alert('Layout saved successfully');
  };

  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    const savedCharts = localStorage.getItem('dashboardCharts');
    if (savedLayout && savedCharts) {
      setLayout(JSON.parse(savedLayout));
      setCharts(JSON.parse(savedCharts));
    }
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Community Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="success" onClick={() => navigate('/data-entry')}>
            Enter Data
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={handleClearData}>Clear Data</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={handleAddChart}>Add Graph</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={handleSaveLayout}>Save Layout</Button>
        </Grid>
      </Grid>
      <GridLayout
        className="layout"
        layout={layout}
        onLayoutChange={(layout) => setLayout(layout)}
        cols={12}
        rowHeight={30}
        width={1200}
        draggableHandle=".card-drag-handle"
        resizeHandles={['se', 'sw']}
      >
        {charts.map((chart, index) => (
          <div key={`chart-${index}`} data-grid={layout.find(l => l.i === `chart-${index}`) || { x: 0, y: 0, w: isMobile ? 12 : 6, h: 8 }}>
            <Card>
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item className="card-drag-handle" style={{ cursor: 'move', padding: '5px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px 0 0 0' }}>
                    <Typography variant="body2">Drag</Typography>
                  </Grid>
                  <Grid item>
                    <Select value={chart.chartType} onChange={(e) => handleChartTypeChange(e, index)}>
                      <MenuItem value="line">Line Chart</MenuItem>
                      <MenuItem value="bar">Bar Chart</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item>
                    <Select value={chart.dataType} onChange={(e) => handleDataTypeChange(e, index)}>
                      <MenuItem value="energy">Energy</MenuItem>
                      <MenuItem value="water">Water</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item>
                    <IconButton color="secondary" onClick={() => handleRemoveChart(index)}>
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                {chart.chartType === 'line' ? (
                  <Line data={formatData(chart.dataType)} />
                ) : (
                  <Bar data={formatData(chart.dataType)} />
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </GridLayout>
    </Container>
  );
};

export default Dashboard;
