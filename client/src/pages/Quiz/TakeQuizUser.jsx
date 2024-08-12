import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Typography, Card, CardContent, Radio, RadioGroup, FormControlLabel, TextField,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http'; // Ensure this is your axios instance
import CircularProgressWithLabel from './QuizCircularProgressWithLabel'; // Import the custom component
import UserContext from '../../contexts/UserContext';

function TakeQuizUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Consume UserContext
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [quitModalOpen, setQuitModalOpen] = useState(false);
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [quizDetails, setQuizDetails] = useState({ title: '', description: '' });

    useEffect(() => {
        if (id) {
            console.log('Fetching quiz details for quiz ID:', id);
            http.get(`/quiz/${id}`)
                .then((res) => {
                    console.log('Quiz details fetched:', res.data);
                    setQuizDetails(res.data);
                })
                .catch((err) => {
                    console.error('Error fetching quiz details:', err);
                });

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

    const calculateScore = async () => {
        try {
            const res = await http.get(`/quiz/question/quizzes/${id}/questions`);
            let correctAnswers = 0;
    
            for (const question of res.data) {
                const userAnswer = userAnswers[question.id];
                const correctAnswer = question.answer_text;
    
                console.log(`Question ID: ${question.id}, User Answer: ${userAnswer}, Correct Answer: ${correctAnswer}`);
    
                try {
                    const response = await http.post('/marker', {
                        // expectedAnswer: question.question_text,
                        question_type: question.question_type,
                        expectedAnswer: correctAnswer,
                        userAnswer: userAnswer
                    });
    
                    if (response.data.isCorrect) {
                        correctAnswers += 1;
                    }
                } catch (error) {
                    console.error('Error checking answer:', error);
                }
            }
    
            const scorePercentage = (correctAnswers / totalQuestions) * 100;
            setScore(scorePercentage);
        } catch (err) {
            console.error('Error calculating score:', err);
        }
    };

    const postQuizHistory = () => {
        const historyData = {
            quizid: parseInt(id, 10),
            userId: user.id, // Use user ID from context
            title: `Quiz ${quizDetails.title}`,
            description: quizDetails.description,
            score: Math.round(score), // Ensure this is an integer between 0 and 100
            dateTaken: new Date().toISOString() // Include the current date as dateTaken
        };
        console.log("score number:", score, 'Posting quiz history:', historyData);

        http.post(`/user/quiz/userhistory/${id}`, historyData)
            .then((res) => {
                console.log('Quiz history posted:', res.data);
                navigate(`/quizzesUser`)
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">{quizDetails.title}</Typography>
            </Box>
            {questions.map((question, index) => (
                <Card key={question.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{`${index + 1}. ${question.question_text}`}</Typography>
                        {renderQuestionItems(question)}
                    </CardContent>
                </Card>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="contained" color="secondary" onClick={handleQuitQuiz}>Quit</Button>
                <Button variant="contained" color="primary" onClick={handleOpenSubmitModal}>Submit</Button>
            </Box>
            <Dialog
                open={quitModalOpen}
                onClose={handleCloseQuitModal}
            >
                <DialogTitle>Quit Quiz</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to quit the quiz?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseQuitModal} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmQuit} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={submitModalOpen}
                onClose={handleCloseSubmitModal}
            >
                <DialogTitle>Submit Quiz</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to submit the quiz?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSubmitModal} color="primary">Cancel</Button>
                    <Button onClick={handleConfirmSubmit} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={resultModalOpen}
                onClose={handleCloseResultModal}
            >

                <DialogTitle>Quiz Result</DialogTitle>
                <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgressWithLabel value={score} />
                </Box>
                <DialogContent>
                    <DialogContentText>Your score: {Math.round(score)}%</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResultModal} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default TakeQuizUser;

