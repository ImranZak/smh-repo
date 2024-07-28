import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Input, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import http from '../http';
import EnhancedTable from './QuizTableUser';

function Quizzes() {
    const [quizzesList, setQuizList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getQuizzes = () => {
        http.get('/quiz').then((res) => {
            setQuizList(res.data);
        });
    };

    useEffect(() => {
        getQuizzes();
    }, []);

    const filteredQuizzes = quizzesList.filter(quiz =>
        (quiz.id.toString().includes(search) ||
        quiz.title.toLowerCase().includes(search.toLowerCase()) ||
        quiz.description.toLowerCase().includes(search.toLowerCase())) &&
        quiz.status.toLowerCase() === 'active'
    );

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Quizzes
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
            <div>
                <EnhancedTable rows={filteredQuizzes} />
            </div>
        </Box>
    );
}

export default Quizzes;

// EnhancedTableUser.js remains the same as before
