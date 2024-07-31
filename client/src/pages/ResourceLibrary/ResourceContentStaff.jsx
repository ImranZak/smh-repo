import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Tooltip, Fab, Card, CardContent, CardMedia, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../http'; // Assuming this is your axios instance

function ResourceContentStaff() {
    const [resource, setResource] = useState({});
    const [resourceContents, setResourceContents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const { postId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch resource details
        http.get(`/resource/${postId}`)
            .then((res) => {
                setResource({
                    title: res.data.title,
                    description: res.data.description
                });
            })
            .catch((err) => {
                console.error('Error fetching resource:', err.response?.data || err.message);
            });

        // Fetch resource contents
        http.get(`/resourceContent/${postId}`)
            .then((res) => {
                setResourceContents(res.data);
            })
            .catch((err) => {
                console.error('Error fetching resource contents:', err.response?.data || err.message);
            });
    }, [postId]);

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenDialog(true);
    };

    const confirmDelete = () => {
        http.delete(`/resourceContent/${deleteId}/${postId}`)
            .then(() => {
                setResourceContents(prevContents => prevContents.filter(content => content.id !== deleteId));
                setOpenDialog(false);
                setDeleteId(null);
            })
            .catch((err) => {
                console.error('Error deleting resource content:', err.response?.data || err.message);
            });
    };

    const handleEdit = (id) => {
        navigate(`/ResourceContentStaff/${postId}/EditResourceContentStaff/${id}`);
    };

    const getEmbedUrl = (url) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        } else if (url.includes('tiktok.com')) {
            return `https://www.tiktok.com/embed/v2/${url.split('/').pop()}`;
        } else if (url.includes('instagram.com')) {
            return `https://www.instagram.com/p/${url.split('/').pop()}/embed`;
        }
        return url;
    };

    const renderContent = (content) => {
        switch (content.type) {
            case 'text':
                return (
                    <Card key={content.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="body1">{content.data}</Typography>
                        </CardContent>
                        <CardContent>
                            <IconButton onClick={() => handleEdit(content.id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(content.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                );
            case 'image':
                const imageUrl = `${import.meta.env.VITE_FILE_BASE_URL}${content.data}`;
                return (
                    <Card key={content.id} sx={{ mb: 2 }}>
                        <CardMedia
                            component="img"
                            image={imageUrl}
                            alt={imageUrl}
                            sx={{ width: '100%', height: 'auto' }}
                        />
                        <CardContent>
                            <IconButton onClick={() => handleEdit(content.id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(content.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                );
            case 'videoLink':
                const embedUrl = getEmbedUrl(content.data);
                return (
                    <Card key={content.id} sx={{ mb: 2 }}>
                        <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                            <CardMedia
                                component="iframe"
                                src={embedUrl}
                                title="Video"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 0
                                }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </Box>
                        <CardContent>
                            <IconButton onClick={() => handleEdit(content.id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(content.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                );
            case 'video':
                return (
                    <Card key={content.id} sx={{ mb: 2 }}>
                        <CardMedia
                            component="video"
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${content.data}`}
                            controls
                            sx={{ width: '100%', height: 'auto' }}
                        />
                        <CardContent>
                            <IconButton onClick={() => handleEdit(content.id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(content.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                );
            case 'file':
                return (
                    <Card key={content.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="body1">
                                <a href={`${import.meta.env.VITE_FILE_BASE_URL}${content.data}`} download>Click this link to download the file on this resource!</a>
                            </Typography>
                            <IconButton onClick={() => handleEdit(content.id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(content.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="div" sx={{ mb: 3 }}>
                {resource.title}
            </Typography>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5">Description</Typography>
                    <Typography variant="body1"><br />{resource.description}</Typography>
                </CardContent>
            </Card>
            <Box>
                {resourceContents.map((content) => renderContent(content))}
            </Box>
            <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Tooltip title="Go Back">
                    <Fab color="primary" onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </Fab>
                </Tooltip>
                <Tooltip title="Add Content">
                    <Fab color="primary" aria-label="add" onClick={() => navigate(`/ResourceContentStaff/${postId}/AddResourceContentStaff`)} sx={{ ml:1 }}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this content?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ResourceContentStaff;
