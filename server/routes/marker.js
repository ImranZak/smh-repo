const express = require('express');
require('dotenv').config();
// const stringSimilarity = require('string-similarity');
// const natural = require('natural');
const router = express.Router();
const axios = require('axios');

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/sentence-transformers/paraphrase-MiniLM-L6-v2';


const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_KEY; // Replace with your actual token

// Function to analyze the user's answer with retries and delay
const analyzeAnswer = async (expectedAnswer, userAnswer, retries = 3) => {
    try {
        const response = await axios.post(
            HUGGING_FACE_API_URL,
            {
                inputs: {
                    "source_sentence": expectedAnswer,
                    "sentences": [userAnswer]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`
                }
            }
        );

        return response.data;
    } catch (error) {
        const errorMsg = error.response ? error.response.data.error : error.message;

        if (retries > 0) {
            console.error('Error analyzing answer:', errorMsg);

            // Check if the error is related to model loading
            if (errorMsg.includes('currently loading')) {
                console.warn('Model is loading. Retrying after delay...');
                await new Promise(resolve => setTimeout(resolve, 20000)); // Wait for 20 seconds
            }

            // Retry after delay
            return analyzeAnswer(expectedAnswer, userAnswer, retries - 1);
        } else {
            console.error('Error analyzing answer, no retries left:', errorMsg);
            throw error;
        }
    }
};

// Route to handle POST requests for answer analysis
router.post('/', async (req, res) => {
    const { question_type, expectedAnswer, userAnswer } = req.body;
    console.log("Received data:", req.body);
    if (question_type === 'multiple_choice') {
        if (expectedAnswer === userAnswer) {
            res.json({ isCorrect: true });
        } else {
            res.json({ isCorrect: false });
        }
    }
    else {
        try {
            console.log('Processing data...');
            const analysis = await analyzeAnswer(expectedAnswer, userAnswer);

            console.log('Analysis:', analysis);

            // Assuming the response from the Hugging Face API includes similarity scores
            const isCorrect = analysis > 0.5; // Adjust the threshold as needed
            console.log('Is Correct:', isCorrect);

            res.json({ isCorrect });
        } catch (error) {
            console.error('Error processing data:', error);
            if (error.response && error.response.data) {
                res.status(500).json({ error: error.response.data });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
});

module.exports = router;
// const wordnet = new natural.WordNet();
// const synonymCache = new Map();

// router.post('/', async (req, res) => {
//     const { question, answer, userAnswer } = req.body;
//     console.log("Received data:", req.body);

//     try {
//             console.log('Processing data...'); // Unique log message
//             const answerKeywords = extractKeywords(answer);
//             const userAnswerKeywords = extractKeywords(userAnswer);

//             console.log('Answer Keywords:', answerKeywords);
//             console.log('User Answer Keywords:', userAnswerKeywords);

//             const synonymMatches = await checkSynonyms(answerKeywords, userAnswerKeywords);
//             const similarity = stringSimilarity.compareTwoStrings(answer, userAnswer);

//             console.log('Similarity:', similarity);
//             console.log('Synonym Matches:', synonymMatches);

//             const isCorrect = similarity > 0 && synonymMatches > 0;
//             console.log('Is Correct:', isCorrect);

//             res.json({ similarity, synonymMatches, isCorrect });

//     } catch (error) {
//         console.error('Error evaluating the question:', error.message);
//         res.status(500).send('Error evaluating the question');
//     }
// });

// function extractKeywords(text) {
//     return text.toLowerCase().split(/\W+/).filter(Boolean);
// }

// async function checkSynonyms(answerKeywords, userAnswerKeywords) {
//     console.log('Checking synonyms...'); // Unique log message
//     const promises = [];

//     for (let answerWord of answerKeywords) {
//         for (let userWord of userAnswerKeywords) {
//             if (answerWord === userWord) {
//                 promises.push(Promise.resolve(true));
//             } else {
//                 promises.push(isSynonymMatch(answerWord, userWord));
//             }
//         }
//     }

//     const results = await Promise.all(promises);
//     const matchCount = results.filter(Boolean).length;
//     return matchCount / answerKeywords.length;
// }

// function isSynonymMatch(word1, word2) {
//     const cacheKey = `${word1}-${word2}`;
//     if (synonymCache.has(cacheKey)) {
//         return Promise.resolve(synonymCache.get(cacheKey));
//     }

//     return new Promise((resolve) => {
//         wordnet.lookup(word1, (results1) => {
//             const synonyms1 = results1.flatMap(result => result.synonyms);
//             wordnet.lookup(word2, (results2) => {
//                 const synonyms2 = results2.flatMap(result => result.synonyms);
//                 const isMatch = synonyms1.includes(word2) || synonyms2.includes(word1);
//                 synonymCache.set(cacheKey, isMatch);
//                 resolve(isMatch);
//             });
//         });
//     });
// }

// module.exports = router;