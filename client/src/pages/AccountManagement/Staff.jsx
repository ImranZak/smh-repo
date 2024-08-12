import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Search, Clear, Edit, Delete } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global'

function Staff() {
    const navigate = useNavigate();
    const [staffList, setStaffList] = useState([]);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    // const { user, setUser } = useContext(UserContext);

    const onSearchChange = (e) => { 
        setSearch(e.target.value); 
    };

    const getStaff = () => {
        http.get('/staff').then((res) => {
            setStaffList(res.data);
        });
    };
    
    const searchStaff = () => {
        http.get(`/staff?search=${search}`).then((res) => {
            setStaffList(res.data);
        });
    };
    
    useEffect(() => {
        getStaff();
    }, []);
    
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchStaff();
        }
    };
    
    const onClickSearch = () => {
        searchStaff();
    };

    const onClickClear = () => {
        setSearch(''); getStaff();
    };
    
    const handleUpdate = (id) => {
        navigate(`/update-staff/${id}`)
    };

    const deleteStaff = () => {
        http.delete(`/staff/${deleteId}`)
            .then((res) => {
                console.log(res.data);
                handleClose();
                getStaff()
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
                Staff
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search" onChange={onSearchChange} onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear} >
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/create-staff" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>Create</Button>
                </Link>
            </Box>

            {/* TODO: Add additional info feature so i can hide some of the columns */}
            <TableContainer component={Paper} sx={{ my: '5%' }}>
                <Table aria-label="staff table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Date Joined</TableCell>
                            <TableCell align="right">Role</TableCell>
                            <TableCell align="right">Department</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Phone Number</TableCell>
                            <TableCell align="right">Date of Birth</TableCell>
                            <TableCell align="right">Home Address</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffList.map((staff) => (
                            <TableRow key={staff.id}>
                                <TableCell component="th" scope="row">
                                    {staff.name}
                                </TableCell>    
                                <TableCell align="right">{dayjs(staff.joinDate).format('YYYY-MM-DD')}</TableCell>
                                <TableCell align="right">{staff.role}</TableCell>
                                <TableCell align="right">{staff.department}</TableCell>
                                <TableCell align="right">{staff.email}</TableCell>
                                <TableCell align="right">{staff.phoneNumber}</TableCell>
                                <TableCell align="right">{staff.birthDate}</TableCell>
                                <TableCell align="right">{staff.homeAddress }</TableCell>
                                <TableCell align="center">
                                    <IconButton variant="contained" color="primary" onClick={() => handleUpdate(staff.id)}>
                                        <Edit />    
                                    </IconButton>
                                    <IconButton variant="contained" color="danger" onClick={() => handleOpen(staff.id)}>
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
                    <Button variant="contained" color="error" onClick={deleteStaff}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Staff;