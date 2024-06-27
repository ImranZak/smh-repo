import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function Staff() {
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        http.get('/staff').then((res) => {
            setStaffList(res.data);
        });
    }, []);

    // Example handlers
    const handleUpdate = (id) => {
        console.log('Update', id);
        // Implement update logic here
    };

    const handleDelete = (id) => {
        console.log('Delete', id);
        // Implement delete logic here
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Staff
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="staff table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Created At</TableCell>
                            <TableCell align="right">Role</TableCell>
                            <TableCell align="right">Department</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Phone Number</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffList.map((staff) => (
                            <TableRow key={staff.id}>
                                <TableCell component="th" scope="row">
                                    {staff.name}
                                </TableCell>
                                <TableCell align="right">{dayjs(staff.createdAt).format(global.datetimeFormat)}</TableCell>
                                <TableCell align="right">{staff.role}</TableCell>
                                <TableCell align="right">{staff.department}</TableCell>
                                <TableCell align="right">{staff.email}</TableCell>
                                <TableCell align="right">{staff.phoneNumber}</TableCell>
                                <TableCell align="center">
                                    <IconButton variant="contained" color="primary" onClick={() => handleUpdate(staff.id)}>
                                        <EditIcon />    
                                    </IconButton>
                                    <IconButton variant="contained" color="secondary" onClick={() => handleDelete(staff.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Staff;