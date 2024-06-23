import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, TextField, Button } from '@mui/material';

const CommunityDashboard = () => {
    const [usageData, setUsageData] = useState([]);
    const [formData, setFormData] = useState({ type: '', value: '' });

    useEffect(() => {
        fetchUsageData();
    }, []);

    const fetchUsageData = async () => {
        try {
            const response = await axios.get('/api/usage');
            setUsageData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/usage', formData);
            fetchUsageData();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Community Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Paper>
                        <Typography variant="h6">Add Usage Data</Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Value"
                                name="value"
                                value={formData.value}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper>
                        <Typography variant="h6">Usage Data</Typography>
                        {usageData.map((data) => (
                            <div key={data.id}>
                                <Typography>
                                    {data.type}: {data.value}
                                </Typography>
                            </div>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CommunityDashboard;
