const express = require('express')
const Questionnaire = require('../models/questionare')
const router = express.Router()

const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated'})
    }
    
    next()
}

router.post('/',  async (req, res) => {
    try { console.log('testing')
        const { title, description, img, createdBy, questions, results, interestCat, approved } = req.body;

        if (!title || !description || !questions || !results || !interestCat || typeof approved !=='boolean') {
            return res.status(400).json({ error: 'All required fields must be provided'})
        }

        const questionnaire = new Questionnaire({
            title, 
            description, 
            img, 
            createdBy,
            questions,
            results,
            interestCat,
            approved
        })
        await questionnaire.save()
        res.status(201).json({ message: 'Questionnaire successfully created!', questionnaire})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})


module.exports = router