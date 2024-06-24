import React, { useEffect, useState } from 'react';
import { Box, Typography, Tooltip, Fab, Card, CardActions, CardContent, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import http from '../http'; // Adjust the path to your http instance

function Questions() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        // Fetch questions from your API
        http.get('/:quizId') // Adjust the endpoint to your actual API endpoint
            .then((res) => {
                setQuestions(res.data);
            })
            .catch((err) => {
                console.error('Error fetching questions:', err);
            });
    }, []);

    return (
        <Box>
            <Box display="flex" flexDirection="column" gap={2}>
                {questions.map((question) => (
                    <Card key={question.id} sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {question.question_text}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {question.question_type}
                            </Typography>
                            <Typography variant="body2">
                                Answer: {question.answer_text}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Edit</Button>
                            <Button size="small">Delete</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Tooltip title="Add Question">
                <Fab color="primary" aria-label="add" sx={{ mb: 2 }}>
                    <AddIcon />
                </Fab>
            </Tooltip>
        </Box>
    );
}

export default Questions;
