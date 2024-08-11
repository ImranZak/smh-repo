const express = require('express');
const stringSimilarity = require('string-similarity');
const natural = require('natural');
const router = express.Router();

const wordnet = new natural.WordNet();
const synonymCache = new Map();

router.post('/', async (req, res) => {
    const { question, answer, userAnswer } = req.body;
    console.log("Received data:", req.body);

    try {
            console.log('Processing data...'); // Unique log message
            const answerKeywords = extractKeywords(answer);
            const userAnswerKeywords = extractKeywords(userAnswer);

            console.log('Answer Keywords:', answerKeywords);
            console.log('User Answer Keywords:', userAnswerKeywords);

            const synonymMatches = await checkSynonyms(answerKeywords, userAnswerKeywords);
            const similarity = stringSimilarity.compareTwoStrings(answer, userAnswer);

            console.log('Similarity:', similarity);
            console.log('Synonym Matches:', synonymMatches);

            const isCorrect = similarity > 0 && synonymMatches > 0;
            console.log('Is Correct:', isCorrect);

            res.json({ similarity, synonymMatches, isCorrect });

    } catch (error) {
        console.error('Error evaluating the question:', error.message);
        res.status(500).send('Error evaluating the question');
    }
});

function extractKeywords(text) {
    return text.toLowerCase().split(/\W+/).filter(Boolean);
}

async function checkSynonyms(answerKeywords, userAnswerKeywords) {
    console.log('Checking synonyms...'); // Unique log message
    const promises = [];

    for (let answerWord of answerKeywords) {
        for (let userWord of userAnswerKeywords) {
            if (answerWord === userWord) {
                promises.push(Promise.resolve(true));
            } else {
                promises.push(isSynonymMatch(answerWord, userWord));
            }
        }
    }

    const results = await Promise.all(promises);
    const matchCount = results.filter(Boolean).length;
    return matchCount / answerKeywords.length;
}

function isSynonymMatch(word1, word2) {
    const cacheKey = `${word1}-${word2}`;
    if (synonymCache.has(cacheKey)) {
        return Promise.resolve(synonymCache.get(cacheKey));
    }

    return new Promise((resolve) => {
        wordnet.lookup(word1, (results1) => {
            const synonyms1 = results1.flatMap(result => result.synonyms);
            wordnet.lookup(word2, (results2) => {
                const synonyms2 = results2.flatMap(result => result.synonyms);
                const isMatch = synonyms1.includes(word2) || synonyms2.includes(word1);
                synonymCache.set(cacheKey, isMatch);
                resolve(isMatch);
            });
        });
    });
}

module.exports = router;