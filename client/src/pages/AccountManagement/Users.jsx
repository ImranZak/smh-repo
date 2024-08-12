import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Search, Clear, Edit, Delete } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';

function Users() {
    const navigate = useNavigate();
    const [usersList, setUsersList] = useState([]);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');

    const onSearchChange = (e) => { 
        setSearch(e.target.value); 
    };

    const getUsers = () => {
        http.get('/user').then((res) => {
            setUsersList(res.data);
        });
    };
    
    const searchUsers = () => {
        http.get(`/user?search=${search}`).then((res) => {
            setUsersList(res.data);
        });
    };
    
    useEffect(() => {
        getUsers();
    }, []);
    
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchUsers();
        }
    };
    
    const onClickSearch = () => {
        searchUsers();
    };

    const onClickClear = () => {
        setSearch(''); getUsers();
    };

    const handleUpdate = (id) => {
        navigate(`/update-user/${id}`)
    };

    const deleteUsers = () => {
        http.delete(`/api/user/${deleteId}`)
            .then((res) => {
                console.log(res.data);
                handleClose();
                getUsers()
            });
    }

    const handleOpen = (id) => {
        setOpen(true);
        setDeleteId(id)
    };
      
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Users
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear} >
                    <Clear />
                </IconButton>
            </Box>

            {/* TODO: Add additional info feature so i can hide some of the columns */}
            <TableContainer component={Paper} sx={{ my: '5%' }}>
                <Table aria-label="users table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Phone Number</TableCell>
                            <TableCell align="right">Date of Birth</TableCell>
                            <TableCell align="right">Mailing Address</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usersList.map((users) => (
                            <TableRow key={users.id}>
                                <TableCell component="th" scope="row">
                                    {users.name}
                                </TableCell>
                                <TableCell align="right">{users.email}</TableCell>
                                <TableCell align="right">{users.phoneNumber}</TableCell>
                                <TableCell align="right">{users.birthDate}</TableCell>
                                <TableCell align="right">{users.mailingAddress }</TableCell>
                                <TableCell align="center">
                                    <IconButton variant="contained" color="primary" onClick={() => handleUpdate(users.id)}>
                                        <Edit />    
                                    </IconButton>
                                    <IconButton variant="contained" color="danger" onClick={() => handleOpen(users.id)}>
                                        <Delete />  
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Tutorial
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this tutorial?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteUsers}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Users;