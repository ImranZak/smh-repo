import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Button, Tooltip, Fab
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import http from '../../http'; // Assuming this is your axios instance

function ResourceContentView() {
    const [resource, setResource] = useState({});
    const [resourceContents, setResourceContents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch resource details
        http.get(`/resource/${id}`)
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
        http.get(`/resourceContent/${id}`)
            .then((res) => {
                setResourceContents(res.data);
            })
            .catch((err) => {
                console.error('Error fetching resource contents:', err.response?.data || err.message);
            });
    }, [id]);

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
                    </Card>
                );
            case 'file':
                return (
                    <Card key={content.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="body1">
                                <a href={`${import.meta.env.VITE_FILE_BASE_URL}${content.data}`} download>Click this link to download the file on this resource!</a>
                            </Typography>
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
            <Tooltip title="Go Back" style={{ textDecoration: 'none', position: 'fixed', bottom: 16, right: 16 }}>
                <Fab color="primary" onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </Fab>
            </Tooltip>
        </Box>
    );
}

export default ResourceContentView;
