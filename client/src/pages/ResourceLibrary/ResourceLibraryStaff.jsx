import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Tooltip, Fab } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import http from '../../http';
import EnhancedTable from './ResourceLibraryTableStaff';

function Resources() {
    const [resourcesList, setResourcesList] = useState([]);
    const [search, setSearch] = useState('');

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
        resource.title.toLowerCase().includes(search.toLowerCase()) ||
        resource.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Resources
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
