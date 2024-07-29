import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Tooltip, Fab, Card, CardContent, CardMedia
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../http'; // Assuming this is your axios instance

function ResourceContentStaff() {
    const [resource, setResource] = useState({});
    const [resourceContents, setResourceContents] = useState([]);
    const { postId } = useParams(); // Corrected to match the parameter name
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
                return (
                    <Card key={content.id} sx={{ mb: 2 }}>
                        <CardMedia
                            component="img"
                            image={content.data}
                            alt="Image"
                            sx={{ height: 140 }}
                        />
                    </Card>
                );
            case 'videoLink':
                return (
                    <Card key={content.id} sx={{ mb: 2 }}>
                        <CardMedia
                            component="iframe"
                            src={content.data}
                            title="Video"
                            sx={{ height: 140 }}
                        />
                    </Card>
                );
            case 'video':
                return (
                    <Card key={content.id} sx={{ mb: 2 }}>
                        <CardMedia
                            component="video"
                            src={content.data}
                            controls
                            sx={{ height: 140 }}
                        />
                    </Card>
                );
            case 'file':
                return (
                    <Card key={content.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="body1">
                                <a href={content.data} download>Download File</a>
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
                    <Typography variant="body1"><br></br>{resource.description}</Typography>
                </CardContent>
            </Card>
            <Box>
                {resourceContents.map((content) => renderContent(content))}
            </Box>
            <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Tooltip title="Add Content">
                    <Fab color="primary" aria-label="add" onClick={() => navigate(`/ResourceContentStaff/${postId}/AddResourceContentStaff`)}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>
        </Box>
    );
}

export default ResourceContentStaff;
