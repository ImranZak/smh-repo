import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Tooltip, Fab } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import http from '../http';
import EnhancedTable from './QuizTableStaff';

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
        quiz.id.toString().includes(search) ||
        quiz.title.toLowerCase().includes(search.toLowerCase()) ||
        quiz.description.toLowerCase().includes(search.toLowerCase())
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
            <Tooltip title="Add Quiz">
                <Link to="/addquiz" style={{ textDecoration: 'none', position: 'fixed', bottom: 16, right: 16 }}>
                    <Fab color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                </Link>
            </Tooltip>
        </Box>
    )
}

export default Quizzes;
