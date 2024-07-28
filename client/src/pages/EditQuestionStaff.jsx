import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Radio, RadioGroup, Typography, Fab, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

const validationSchema = yup.object({
    question_text: yup.string().trim().required('Question is required'),
    question_items: yup.array().of(yup.string().trim().required('Choice is required')),
    question_type: yup.string().required('Question type is required'),
    answer_text: yup.string().trim().required('Answer is required'),
});

const EditQuestion = () => {
    const { quizId, questionId } = useParams();
    const navigate = useNavigate();
    const [choices, setChoices] = useState([]);

    useEffect(() => {
        http.get(`/quiz/question/quizzes/${quizId}/questions/${questionId}`)
            .then((res) => {
                const question = res.data;
                // Convert comma-separated string to an array of choices
                const questionItemsArray = question.question_items ? question.question_items.split(',').map(item => item.trim()) : [];
                formik.setValues({
                    question_text: question.question_text,
                    question_items: questionItemsArray,
                    question_type: question.question_type,
                    answer_text: question.answer_text
                });
                setChoices(questionItemsArray);
            })
            .catch((err) => {
                console.error('Error fetching question:', err);
            });
    }, [quizId, questionId]);

    const formik = useFormik({
        initialValues: {
            question_text: '',
            question_items: [],
            question_type: '',
            answer_text: ''
        },
        validationSchema,
        onSubmit: (data) => {
            const payload = {
                quizId: parseInt(quizId, 10),
                question_text: data.question_text,
                question_items: data.question_type === 'multiple_choice' ? choices.filter(choice => choice !== '').join(', ') : null,
                question_type: data.question_type,
                answer_text: data.answer_text
            };
            console.log('Payload', payload)
            http.put(`/quiz/question/quizzes/${payload.quizId}/questions/${questionId}`, payload)
                .then((res) => {
                    navigate(`/quizzesStaff/${quizId}/questions`);
                })
                .catch((err) => {
                    console.error('Error updating question:', err);
                });
        }
    });

    const handleQuestionTypeChange = (event) => {
        formik.setFieldValue('question_type', event.target.value);
        if (event.target.value === 'multiple_choice') {
            setChoices(['', '']);
        } else {
            setChoices([]);
        }
    };

    const handleChoiceChange = (index, event) => {
        const newChoices = [...choices];
        newChoices[index] = event.target.value;
        setChoices(newChoices);
        formik.setFieldValue('question_items', newChoices);
    };

    const handleRemoveChoice = (index) => {
        if (choices.length > 2) {
            const newChoices = [...choices];
            newChoices.splice(index, 1);
            setChoices(newChoices);
            formik.setFieldValue('question_items', newChoices);
        }
    };

    const addChoice = () => {
        setChoices([...choices, '']);
    };

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            <FormControl fullWidth error={formik.touched.question_type && Boolean(formik.errors.question_type)}>
                <InputLabel shrink={formik.values.question_type !== ""}>Question Type</InputLabel>
                <Select
                    name="question_type"
                    value={formik.values.question_type}
                    onChange={handleQuestionTypeChange}
                    onBlur={formik.handleBlur}
                    label="Question Type"
                >
                    <MenuItem value="Open_Ended">Open Ended</MenuItem>
                    <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                </Select>
                {formik.touched.question_type && formik.errors.question_type && (
                    <Typography color="error">{formik.errors.question_type}</Typography>
                )}
            </FormControl>

            {formik.values.question_type && (
                <>
                    <TextField
                        label="Question Name"
                        name="question_text"
                        value={formik.values.question_text}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.question_text && Boolean(formik.errors.question_text)}
                        helperText={formik.touched.question_text && formik.errors.question_text}
                        required
                        fullWidth
                    />
                    {formik.values.question_type === 'Open_Ended' && (
                        <TextField
                            label="Answer"
                            name="answer_text"
                            value={formik.values.answer_text}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.answer_text && Boolean(formik.errors.answer_text)}
                            helperText={formik.touched.answer_text && formik.errors.answer_text}
                            required
                            fullWidth
                        />
                    )}
                    {formik.values.question_type === 'multiple_choice' && (
                        <>
                            <Typography variant="h6">Choices</Typography>
                            <RadioGroup>
                                {choices.map((choice, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                        <Radio disabled />
                                        <TextField
                                            value={choice}
                                            onChange={(e) => handleChoiceChange(index, e)}
                                            onBlur={formik.handleBlur}
                                            error={Boolean(formik.errors.question_items && formik.errors.question_items[index])}
                                            helperText={formik.errors.question_items && formik.errors.question_items[index]}
                                            required
                                            fullWidth
                                        />
                                        {choices.length > 2 && (
                                            <Button variant="outlined" onClick={() => handleRemoveChoice(index)}>Remove</Button>
                                        )}
                                    </Box>
                                ))}
                            </RadioGroup>
                            <Button
                                variant="outlined"
                                onClick={addChoice}
                                style={{
                                    textDecoration: 'none',
                                    position: 'fixed',
                                    bottom: 16,
                                    right: 16,
                                    background: '#1976d2',
                                    color: 'white'
                                }}
                            >
                                Add Choice
                            </Button>
                            <TextField
                                label="Answer"
                                name="answer_text"
                                value={formik.values.answer_text}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.answer_text && Boolean(formik.errors.answer_text)}
                                helperText={formik.touched.answer_text && formik.errors.answer_text}
                                required
                                fullWidth
                            />
                        </>
                    )}
                    <Button type="submit" variant="contained">Submit</Button>
                </>
            )}
            <Tooltip title="Go Back">
                <Link to={`/quizzesStaff/${quizId}/questions`} style={{ textDecoration: 'none', position: 'fixed', bottom: 16, right: 16 }}>
                    <Fab color="primary" aria-label="add">
                        <ArrowBackIcon />
                    </Fab>
                </Link>
            </Tooltip>
        </Box>
    );
};

export default EditQuestion;
