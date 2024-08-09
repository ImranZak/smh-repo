import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Container, Divider } from '@mui/material';

import './DataFeedbacks.css';

const faqs = [
    {
        question: "How do I find an event",
        answer: "You can find an event by searching in the 'Upcoming Events' banner or the Events page. From there, you are able to register for an event."
    },
    {
        question: "Which events did I register for? Or what facilities did I book",
        answer: "These can be found on your dashboard. There are interactable tabs to view your registered events and booked facilities seperately."
    },
    {
        question: "What if I want to learn more about sustainable living?",
        answer: "You can find the materials on the Resource Library tab on your dashboard."
    },
    {
        question: "How do I provide feedback?",
        answer: "On your dashboard, there is a feedback tab. You can access your inputed feedback, add, update and delete your fedback."
    }
];

function Faq() {
    return (
        <Container>
            <div className='feedback-header'>
                <Typography variant="h5" sx={{
                    my: 2, color: 'white', width: '100%', fontWeight: 'bold', fontStyle: 'Roboto', alignItems: 'center'
                }}> Frequently Asked Questions</Typography>
            </div>
            
            <Box sx={{ flexGrow: 1, backgroundColor: "white", padding: 1 }}>
                <List>
                    {faqs.map((faq, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start" sx={{ marginBottom: 1 }}>
                                <ListItemText
                                    primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>{faq.question}</Typography>}
                                    secondary={faq.answer}
                                />
                            </ListItem>
                            {index < faqs.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Container>
    )
}

export default Faq