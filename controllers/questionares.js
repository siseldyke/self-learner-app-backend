const express = require('express')
const Questionnaire = require('../models/questionare')
const router = express.Router()

const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated'})
    }
    
    next()
}

router.post('/questionnaire', isAuthenticated, async (req, res) => {
    try {
        const { title, description, img, questions, results } = req.body;

        if (!title || !description || !questions || !results) {
            return res.status(400).json({ error: 'All required fields must be provided'})
        }

        const questionnaire = new Questionnaire({
            title, 
            description, 
            img, 
            createdBy: req.user._id,
            questions,
            results
        })
        await questionnaire.save()
        res.status(201).json({ message: 'Questionnaire successfully created!', questionnaire})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})