import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Input, IconButton, Button } from '@mui/material';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';
import RecyclingOutlinedIcon from '@mui/icons-material/RecyclingOutlined';
import { Search, Clear } from '@mui/icons-material';
import http from '../../http';
import UserContext from '../../contexts/UserContext';
import UserQuizHistoryTable from './UserQuizHistoryTable';

function UserHistoryPage() {
    const [historyList, setHistoryList] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
    };

    const getUserHistory = () => {
        if (user) {
            http.get(`/user/quiz/userhistory/${user.id}`).then((res) => {
                const formattedHistory = res.data.map(history => ({
                    ...history,
                    dateTaken: formatDate(history.dateTaken)
                }));
                setHistoryList(formattedHistory);
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
                <Input value={search} placeholder="Search by ID, Title or Description" onChange={onSearchChange} />
                <IconButton color="primary">
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={() => setSearch('')}>
                    <Clear />
                </IconButton>
            </Box>
            <UserQuizHistoryTable rows={filteredHistory} />
        </Box>
    );
}

export default UserHistoryPage;
