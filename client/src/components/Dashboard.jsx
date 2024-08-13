import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Responsive, WidthProvider } from 'react-grid-layout';
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
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  Button,
  Grid,
  Container,
  IconButton,
  Fab,
  Drawer,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import FriendList from './Friends';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Messages from './Messages';
import UserContext from '../contexts/UserContext';
import '../styles/Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

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
  const { user, isStaff } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [charts, setCharts] = useState([]);
  const [layout, setLayout] = useState([]);
  const [isFriendListOpen, setIsFriendListOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/api/usage`);
        setData(Array.isArray(result.data) ? result.data : []);
        console.log("Usage data fetched: ", result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const formatData = (dataType) => {
    const labels = data.map(d => new Date(d.date).toLocaleDateString());
    const usageData = data.filter(d => d.type === dataType).map(d => d.amount); // Update to use 'amount'

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
    if (charts.length >= 4) return; // Limit to 4 charts max
    const newLayout = [...layout, { i: `chart-${charts.length}`, x: (charts.length % 2), y: Math.floor(charts.length / 2), w: 1, h: 1 }];
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
      await axios.delete(`http://localhost:3001/api/usage`);
      setData([]);
      alert('Data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const handleSaveLayout = () => {
    localStorage.setItem(`dashboardLayout-${user.id}`, JSON.stringify(layout));
    localStorage.setItem(`dashboardCharts-${user.id}`, JSON.stringify(charts));
    alert('Layout saved successfully');
  };

  useEffect(() => {
    const savedLayout = localStorage.getItem(`dashboardLayout-${user.id}`);
    const savedCharts = localStorage.getItem(`dashboardCharts-${user.id}`);
    if (savedLayout && savedCharts) {
      setLayout(JSON.parse(savedLayout));
      setCharts(JSON.parse(savedCharts));
    }
  }, [user]);

  const toggleFriendList = () => {
    setIsFriendListOpen(!isFriendListOpen);
  };

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
          {isStaff && (
            <Button variant="contained" color="success" onClick={handleClearData}>Clear Data</Button>
          )}
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={handleAddChart}>Add Graph</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={handleSaveLayout}>Save Layout</Button>
        </Grid>
      </Grid>
      <div className="dashboard-grid">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200 }}
          cols={{ lg: 2 }}
          rowHeight={300} // Adjusted the rowHeight to make charts narrower
          width={1000}    // Adjusted width to prevent charts from bleeding out
          compactType={null}
          preventCollision={true}
          isDraggable={true}
          isResizable={true}
          draggableHandle=".card-drag-handle" // Enable dragging only by clicking the drag handle
        >
          {charts.map((chart, index) => (
            <div key={`chart-${index}`} data-grid={{ x: index % 2, y: Math.floor(index / 2), w: 1, h: 1 }}>
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
                    {isStaff && (
                      <Grid item>
                        <IconButton color="secondary" onClick={() => handleRemoveChart(index)}>
                          <CloseIcon />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                  <div className="chart-container">
                    {chart.chartType === 'line' ? (
                      <Line data={formatData(chart.dataType)} />
                    ) : (
                      <Bar data={formatData(chart.dataType)} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12}>
          <Typography variant="h6"></Typography>
          <Messages />
        </Grid>
        <Grid item xs={12}>
        </Grid>
      </Grid>
      <Fab
        color="primary"
        aria-label="toggle-friends"
        onClick={toggleFriendList}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1300,
        }}
      >
        {isFriendListOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
      </Fab>

      <Drawer
        anchor="bottom"
        open={isFriendListOpen}
        onClose={toggleFriendList}
        PaperProps={{ style: { height: '500px', width: '300px', position: 'fixed', bottom: '0', right: '0', left: 'unset' } }}
      >
        <div style={{ padding: '20px' }}>
          <FriendList />
        </div>
      </Drawer>
      <footer style={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">© 2024 Community Dashboard</Typography>
      </footer>
    </Container>
  );
};

export default Dashboard;
