import React, { useEffect, useState, useContext } from 'react';
import http from '../http';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from
    '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function StaffEvents() {
    const [eventList, setEventList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const getEvents = () => {
        http.get('/event').then((res) => {
            setEventList(res.data);
        });
    };
    const searchEvents = () => {
        http.get(`/event?search=${search}`).then((res) => {
            setEventList(res.data);
        });
    };
    useEffect(() => {
        getEvents();
    }, []);
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchEvents();
        }
    };
    const onClickSearch = () => {
        searchEvents();
    }
    const onClickClear = () => {
        setSearch('');
        getEvents();
    };

    useEffect(() => {
        http.get('/event').then((res) => {
            console.log(res.data);
            setEventList(res.data);
        });
    }, []);
    const openGoogleMaps = (address) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    };
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/addevent" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add
                    </Button>
                </Link>
            </Box>

            <Grid container spacing={2}>
                {
                    eventList.map((event, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={event.id}>
                                <Card>
                                    {
                                        event.imageFile && (
                                            <Box className="aspect-ratio-container">
                                                <img alt="event"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {event.name}
                                            </Typography>
                                            <Link to={`/editevent/${event.id}`}>
                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Description: {event.description}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Status: {event.status}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Type: {event.type}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Staff Notes: {event.notes}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Date of Event: {event.date}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Location: {event.location}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}
export default StaffEvents;