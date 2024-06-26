import React, { useEffect, useState } from 'react';
import { Box, Typography, Tooltip, Fab, Card, CardActions, CardContent, Button, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom'; // Assuming you're using react-router for routing
import http from '../http'; // Adjust the path to your http instance

function Questions() {
    const { quizId } = useParams(); // Fetch the quiz ID from the URL parameters
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (quizId) {
            http.get(`/quiz/question/quizzes/${quizId}/questions`) // Adjust the endpoint to match your API
                .then((res) => {
                    setQuestions(res.data);
                })
                .catch((err) => {
                    console.error('Error fetching questions:', err);
                });
        }
    }, [quizId]);

    const renderQuestionItems = (question) => {
        if (question.question_type === 'multiple_choice' && question.question_items) {
            const items = question.question_items.split(',').map(item => item.trim());
            return (
                <RadioGroup name={`question-${question.id}`}>
                    {items.map((item, index) => (
                        <FormControlLabel key={index} value={item} control={<Radio />} label={item} />
                    ))}
                </RadioGroup>
            );
        } else if (question.question_type === 'Open_Ended') {
            return (
                <TextField
                    name={`question-${question.id}`}
                    label="Your Answer"
                    variant="outlined"
                    fullWidth
                />
            );
        }
        return null;
    };

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
                            {renderQuestionItems(question)}
                        </CardContent>
                        <CardActions>
                            <Button size="small">Edit</Button>
                            <Button size="small">Delete</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
            <Tooltip title="Add Question" style={{ textDecoration: 'none', position: 'fixed', bottom: 16, right: 16 }}>
                <Fab color="primary" aria-label="add" sx={{ mb: 2 }}>
                    <AddIcon />
                </Fab>
            </Tooltip>
        </Box>
    );
}

export default Questions;
