import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Container } from '@mui/material';

const faqs = [
    {
        question: "How do I find an event",
        answer: "You can find an event by searching in the 'Upcoming Events' banner or the Events page. From there, you are able to register for an event."
    },
    {
        question: "Which events did I regidter for? Or what facilities did I book",
        answer: "These can be found on your dashboard. There are interactable tabs to view your registered events and booked facilities seperately."
    },
    {
        question: "?",
        answer: "."
    },
    {
        question: "?",
        answer: "."
    },
    {
        question: "How do I provide feedback?",
        answer: "."
    }
];

function Faq() {
    return (
        <Container>
            <Box sx={{ flexGrow: 1, backgroundColor: "white", padding: 4 }}>
                <Typography variant="h5" sx={{ my: 2 }}>Frequently Asked Questions</Typography>
                <List>
                    {faqs.map((faq, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemText
                                primary={<Typography variant="h6">{faq.question}</Typography>}
                                secondary={<Typography variant="body1">{faq.answer}</Typography>}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    )
}

export default Faq