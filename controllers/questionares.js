const express = require('express')
const Questionnaire = require('../models/questionare')
const router = express.Router()
const User = require('../models/user');

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

router.post('/:questionaresId/submit', async (req, res) => {
  try {
    const { answers, userId } = req.body;
    const questionnaire = await Questionnaire.findById(req.params.questionaresId);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const result = calculatePoints(questionnaire, answers);
    user.fitnessPoints = Math.min(user.fitnessPoints + result.fitnessPoints, 20);
    user.videoGamesPoints = Math.min(user.videoGamesPoints + result.videoGamesPoints, 20);
    user.boardGamesPoints = Math.min(user.boardGamesPoints + result.boardGamesPoints, 20);
    user.musicInsPoints = Math.min(user.musicInsPoints + result.musicInsPoints, 20);

    await user.save();

    const maxPoints = Math.max(result.fitnessPoints, result.videoGamesPoints, result.boardGamesPoints, result.musicInsPoints);
    let finalResult = {};
    if (maxPoints === result.fitnessPoints) {
      finalResult = questionnaire.results.find(r => r.name === 'Fitness');
    } else if (maxPoints === result.videoGamesPoints) {
      finalResult = questionnaire.results.find(r => r.name === 'Video Games');
    } else if (maxPoints === result.boardGamesPoints) {
      finalResult = questionnaire.results.find(r => r.name === 'Tabletop Games');
    } else if (maxPoints === result.musicInsPoints) {
      finalResult = questionnaire.results.find(r => r.name === 'Music');
    }

    res.status(200).json({ result, finalResult, message: 'Questionnaire submitted successfully and points updated.' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const calculatePoints = (questionnaire, answers) => {
  let fitnessPoints = 0;
  let videoGamesPoints = 0;
  let boardGamesPoints = 0;
  let musicInsPoints = 0;

  for (const [questionId, answer] of Object.entries(answers)) {
    const question = questionnaire.questions.find(q => q._id == questionId);
    if (question) {
      question.options.forEach(option => {
        if (option.text === answer) {
          option.scores.forEach(score => {
            if (score.possibleResult === 'fitness') fitnessPoints += score.value;
            if (score.possibleResult === 'videoGames') videoGamesPoints += score.value;
            if (score.possibleResult === 'boardGames') boardGamesPoints += score.value;
            if (score.possibleResult === 'music') musicInsPoints += score.value;
          });
        }
      });
    }
  }

  return { fitnessPoints, videoGamesPoints, boardGamesPoints, musicInsPoints };
};

module.exports = router