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
    try { 
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

router.get('/', async (req, res) => {
    try {
      const foundQuestionnaires = await Questionnaire.find();
      res.status(200).json(foundQuestionnaires);
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  });

  router.get('/:questionaresId', async (req, res) => {
    try {
      const foundQuestionnaire = await Questionnaire.findById(req.params.questionaresId);
      if (!foundQuestionnaire) {
        res.status(404);
        throw new Error('Questionnaire not found.');
      }
      res.status(200).json(foundQuestionnaire);
    } catch (error) {
      if (res.statusCode === 404) {
        res.json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  router.delete('/:questionaresId', async (req, res) => {
    try { const foundQuestionnaire = await Questionnaire.findByIdAndDelete(req.params.questionaresId)
        
        if (!foundQuestionnaire) {
            res.status(404)
            throw new Error('This is a test error');
        }
        res.status(200).json(`${foundQuestionnaire.title} has been deleted.`);
        } catch (error) {
            if (res.statusCode === 404) {
                res.json({ error: error.message });
              } else {
             res.status(500).json({ error: error.message });
        }
    }
  });

  router.put('/:questionaresId', async (req, res) => {
    try {
      const updatedQuestionnaire = await Questionnaire.findByIdAndUpdate(req.params.questionaresId, req.body,  {new: true,});
      if (!updatedQuestionnaire) {
        res.status(404);
        throw new Error('Questionnaire not found.');
      }
      res.status(200).json(updatedQuestionnaire);
    } catch (error) {
      
      if (res.statusCode === 404) {
        res.json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });
module.exports = router