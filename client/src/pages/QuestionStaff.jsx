import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Tooltip, Fab, Card, CardActions, CardContent, Button, Radio, RadioGroup,
    FormControlLabel, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useParams } from 'react-router-dom';
import http from '../http'; // Assuming this is your axios instance

function Questions() {
    const { quizId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    useEffect(() => {
        if (quizId) {
            http.get(`/quiz/question/quizzes/${quizId}/questions`)
                .then((res) => {
                    setQuestions(res.data);
                })
                .catch((err) => {
                    console.error('Error fetching questions:', err);
                });
        }
    }, [quizId]);

    const handleDeleteQuestion = (questionId) => {
        setQuestionToDelete(questionId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        http.delete(`/quiz/question/quizzes/${quizId}/questions/${questionToDelete}`)
            .then((res) => {
                console.log(res.data.message); // Log success message if needed
                // Update state to remove the deleted question from UI
                setQuestions(questions.filter(q => q.id !== questionToDelete));
                setDeleteModalOpen(false); // Close the modal after deletion
            })
            .catch((err) => {
                console.error('Error deleting question:', err);
            });
    };

    const handleCloseModal = () => {
        setDeleteModalOpen(false);
        setQuestionToDelete(null);
    };

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

    const formatQuestionType = (questionType) => {
        if (!questionType) return '';
        return questionType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    return (
        <Box>
            <Typography variant="h4" component="div" sx={{ mt: 3, mb: 3 }}>
                Questions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                {questions.length === 0 ? (
                    <Card sx={{ mt: 6, minWidth: 275, backgroundColor: '#f0f0f0', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CardContent>
                            <Typography variant="h5" component="div" color="textSecondary" textAlign="center">
                                Currently no questions in quiz
                            </Typography>
                        </CardContent>
                    </Card>

                ) : (
                    questions.map((question) => (
                        <Card key={question.id} sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {question.question_text}
                                </Typography>
                                <Typography sx={{ mb: 1.5, mt: 1.5 }} color="text.secondary">
                                    {formatQuestionType(question.question_type)}
                                </Typography>
                                {renderQuestionItems(question)}
                                <Typography sx={{ mt: 3 }}>
                                    Answer: {question.answer_text}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ mt: 1 }}>
                                <Link to={`/quizzesStaff/${quizId}/editquestion/${question.id}`}>
                                    <Button size="small">Edit</Button>
                                </Link>
                                <Button size="small" onClick={() => handleDeleteQuestion(question.id)}>Delete</Button>
                            </CardActions>
                        </Card>
                    ))
                )}
            </Box>
            <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', gap: 2 }}>
                <Tooltip title="Go Back">
                    <Link to={`/quizzesStaff`} style={{ textDecoration: 'none' }}>
                        <Fab color="primary" aria-label="back" sx={{ width: 56, height: 56 }}>
                            <ArrowBackIcon />
                        </Fab>
                    </Link>
                </Tooltip>
                <Tooltip title="Add Question">
                    <Link to={`/quizzesStaff/${quizId}/addquestion`} style={{ textDecoration: 'none' }}>
                        <Fab color="primary" aria-label="add" sx={{ width: 56, height: 56 }}>
                            <AddIcon />
                        </Fab>
                    </Link>
                </Tooltip>

            </Box>
            <Dialog open={deleteModalOpen} onClose={handleCloseModal}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this question?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Questions;
