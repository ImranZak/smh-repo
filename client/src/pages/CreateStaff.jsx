import React from 'react'
import { Box, Typography, TextField, Button } from '@mui/material';

function CreateStaff() {
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Tutorial
            </Typography>
            <Box component="form">
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="Title"
                    name="title"
                />
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    multiline
                    minRows={2}
                    label="Description"
                    name="description"
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default CreateStaff