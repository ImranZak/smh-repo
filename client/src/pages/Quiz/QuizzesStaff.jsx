import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Tooltip, Fab, Button } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';
import RecyclingOutlinedIcon from '@mui/icons-material/RecyclingOutlined';
import http from '../../http';
import EnhancedTable from './QuizTableStaff';

function QuizzesStaff() {
    const [quizzesList, setQuizList] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

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
        (selectedTag ? quiz.tag === selectedTag : true)
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
            <Box sx={{ mb: 2 }}>
                {/* Tag buttons for filtering */}
                <Button
                    variant={selectedTag === 'waste reduction' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTag(selectedTag === 'waste reduction' ? '' : 'waste reduction')}
                    startIcon={<RecyclingOutlinedIcon />}
                    sx={{ borderRadius: '50%', mr: 1 }}
                >
                    Waste Reduction
                </Button>
                <Button
                    variant={selectedTag === 'energy conservation' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTag(selectedTag === 'energy conservation' ? '' : 'energy conservation')}
                    startIcon={<FlashOnOutlinedIcon />}
                    sx={{ borderRadius: '50%', mr: 1 }}
                >
                    Energy Conservation
                </Button>
                <Button
                    variant={selectedTag === 'water management' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTag(selectedTag === 'water management' ? '' : 'water management')}
                    startIcon={<WaterDropOutlinedIcon />}
                    sx={{ borderRadius: '50%', mr: 1 }}
                >
                    Water Management
                </Button>
                <Button
                    variant={selectedTag === 'green living tips' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTag(selectedTag === 'green living tips' ? '' : 'green living tips')}
                    startIcon={<LocalFloristOutlinedIcon />}
                    sx={{ borderRadius: '50%', mr: 1 }}
                >
                    Green Living Tips
                </Button>
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
    );
}

export default QuizzesStaff;
