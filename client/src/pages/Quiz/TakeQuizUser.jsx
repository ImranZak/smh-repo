import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, CardContent, Radio, RadioGroup, FormControlLabel, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http'; // Ensure this is your axios instance
import CircularProgressWithLabel from './QuizCircularProgressWithLabel'; // Import the custom component

function TakeQuizUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [quitModalOpen, setQuitModalOpen] = useState(false);
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    useEffect(() => {
        if (id) {
            console.log('Fetching questions for quiz ID:', id);
            http.get(`/quiz/question/quizzes/${id}/questions`)
                .then((res) => {
                    console.log('Questions fetched:', res.data);
                    setQuestions(res.data);
                    setTotalQuestions(res.data.length);
                })
                .catch((err) => {
                    console.error('Error fetching questions:', err);
                });
        }
    }, [id]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.history.pushState(null, null, window.location.href);
        const handlePopState = (event) => {
            event.preventDefault();
            setQuitModalOpen(true);
            window.history.pushState(null, null, window.location.href);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const handleQuitQuiz = () => {
        setQuitModalOpen(true);
    };

    const handleConfirmQuit = () => {
        setQuitModalOpen(false);
        navigate('/quizzesUser'); // Navigate to a different route after quitting the quiz
    };

    const handleCloseQuitModal = () => {
        setQuitModalOpen(false);
    };

    const handleOpenSubmitModal = () => {
        setSubmitModalOpen(true);
    };

    const handleCloseSubmitModal = () => {
        setSubmitModalOpen(false);
    };

    const handleConfirmSubmit = () => {
        if (Object.keys(userAnswers).length === totalQuestions) {
            calculateScore(); // Calculate the score before showing the result dialog
        } else {
            alert('Please answer all the questions before submitting.');
        }
    };

    useEffect(() => {
        if (score > 0) { // Check if score has been calculated before posting
            postQuizHistory(); // Post the quiz results to the UserQuizHistory endpoint
            setSubmitModalOpen(false);
            setResultModalOpen(true); // Open the result dialog
        }
    }, [score]);

    const handleCloseResultModal = () => {
        setResultModalOpen(false);
        navigate('/quizzesUser'); // Navigate or handle submission after showing the results
    };

    const handleAnswerChange = (questionId, value) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: value
        }));
    };

    const calculateScore = () => {
        http.get(`/quiz/question/quizzes/${id}/questions`)
            .then((res) => {
                const correctAnswers = res.data.reduce((acc, question) => {
                    const userAnswer = userAnswers[question.id];
                    const correctAnswer = question.answer_text;

                    console.log(`Question ID: ${question.id}, User Answer: ${userAnswer}, Correct Answer: ${correctAnswer}`);

                    if (userAnswer && correctAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                        return acc + 1;
                    }
                    return acc;
                }, 0);

                const scorePercentage = (correctAnswers / totalQuestions) * 100;
                setScore(scorePercentage);
            })
            .catch((err) => {
                console.error('Error calculating score:', err);
            });
    };

    const postQuizHistory = () => {
        const historyData = {
            quizid: parseInt(id, 10),
            userid: 1, // Assuming user ID is 1 for now
            title: `Quiz ${id} Results`,
            description: `User's results for quiz ${id}`,
            score: Math.round(score) // Ensure this is an integer between 0 and 100
        };
        console.log("score number:", score, 'Posting quiz history:', historyData);

        http.post(`/user/quiz/userhistory/${id}`, historyData)
            .then((res) => {
                console.log('Quiz history posted:', res.data);
            })
            .catch((err) => {
                console.error('Error posting quiz history:', err.response ? err.response.data : err);
            });
    };

    const renderQuestionItems = (question) => {
        if (question.question_type === 'multiple_choice' && question.question_items) {
            const items = question.question_items.split(',').map(item => item.trim());
            return (
                <RadioGroup
                    name={`question-${question.id}`}
                    value={userAnswers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                >
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
                    value={userAnswers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
            );
        }
        return null;
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
                                {renderQuestionItems(question)}
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleQuitQuiz}>
                    Quit Quiz
                </Button>
                <Button variant="contained" color="secondary" onClick={handleOpenSubmitModal}>
                    Submit
                </Button>
            </Box>
            <Dialog open={quitModalOpen} onClose={handleCloseQuitModal}>
                <DialogTitle>Confirm Quit</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to quit the quiz? Your progress will not be saved.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseQuitModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmQuit} color="primary" autoFocus>
                        Quit
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={submitModalOpen} onClose={handleCloseSubmitModal}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to submit your answers? Your responses will be final.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSubmitModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={resultModalOpen} onClose={handleCloseResultModal}>
                <DialogTitle>Quiz Results</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgressWithLabel value={score} />
                    </Box>
                    <DialogContentText>
                        
                        Your Score is {score.toFixed(2)}%
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResultModal} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default TakeQuizUser;
