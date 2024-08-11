import React, { useEffect, useState, useContext } from 'react';
import http from '../../http';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from
    '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function SignUps() {
    const [signupList, setSignUpsList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (s) => {
        setSearch(e.target.value);
    };
    const getSignUps = () => {
        http.get('/signup').then((res) => {
            setSignUpsList(res.data);
        });
    };
    const searchSignUps = () => {
        http.get(`/signup?search=${search}`).then((res) => {
            setSignUpsList(res.data);
        });
    };
    useEffect(() => {
        getSignUps();
    }, []);
    const onSearchKeyDown = (s) => {
        if (s.key === "Enter") {
            searchSignUps();
        }
    };
    const onClickSearch = () => {
        searchSignUps();
    }
    const onClickClear = () => {
        setSearch('');
        getSignUps();
    };

    useEffect(() => {
        http.get('/signup').then((res) => {
            console.log(res.data);
            setSignUpsList(res.data);
        });
    }, []);
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
            SignUps
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
            </Box>

            <Grid container spacing={2}>
                {
                    signupList.map((signup, i) => { 
                        return (
                            <Grid>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {signup.user_name}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Email: {signup.email}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Phone Number: {signup.phone}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            NRIC: {signup.nric}
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
export default SignUps;