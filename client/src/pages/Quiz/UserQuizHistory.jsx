import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Input, IconButton, Button } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import http from '../../http';
import UserContext from '../../contexts/UserContext';
import UserQuizHistoryTable from './UserQuizHistoryTable';

function UserHistoryPage() {
    const [historyList, setHistoryList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getUserHistory = () => {
        let id = user.id
        if (user) {
            http.get(`/user/quiz/userhistory/${id}`).then((res) => {
                setHistoryList(res.data);
            }).catch((err) => {
                console.error('Error fetching user history:', err);
            });
        }
    };

    useEffect(() => {
        if (user) {
            getUserHistory();
        }
    }, [user]);

    const filteredHistory = historyList.filter(history =>
    (history.id.toString().includes(search) ||
        history.title.toLowerCase().includes(search.toLowerCase()) ||
        history.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                User Quiz History
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search by ID, Title or Description"
                    onChange={onSearchChange} />
                <IconButton color="primary" onClick={() => { }}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={() => setSearch('')}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
            </Box>

            <UserQuizHistoryTable rows={filteredHistory} />
        </Box>
    );
}

export default UserHistoryPage;
