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
import EnhancedTable from './ResourceLibraryTableStaff';

function Resources() {
    const [resourcesList, setResourcesList] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getResources = () => {
        http.get('/resource').then((res) => {
            setResourcesList(res.data);
        });
    };

    useEffect(() => {
        getResources();
    }, []);

    const filteredResources = resourcesList.filter(resource =>
        (resource.id.toString().includes(search) ||
        resource.title.toLowerCase().includes(search.toLowerCase())) &&
        (selectedTag ? resource.tag === selectedTag : true)
    );

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Resources
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search by ID or Title" onChange={onSearchChange} />
                <IconButton color="primary">
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={() => setSearch('')}>
                    <Clear />
                </IconButton>
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
                <EnhancedTable rows={filteredResources} />
            </div>
            <Tooltip title="Add Resource">
                <Link to="/AddResource" style={{ textDecoration: 'none', position: 'fixed', bottom: 16, right: 16 }}>
                    <Fab color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                </Link>
            </Tooltip>
        </Box>
    );
}

export default Resources;
