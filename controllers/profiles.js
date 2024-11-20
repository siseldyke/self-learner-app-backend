const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token')

router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:userId', verifyToken, async (req, res) => {
    try {
      if (req.user._id !== req.params.userId){ 
          return res.status(401).json({ error: "Unauthorized"})
      }
      const user = await User.findById(req.params.userId);
      if (!user) {
        res.status(404);
        throw new Error('Profile not found.');
      }
      res.json({ user });
    } catch (error) {
      if (res.statusCode === 404) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

router.put('/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404);
      throw new Error('Profile not found.');
    }

    const { mentorStatus, fitnessPoints, videoGamesPoints, boardGamesPoints, musicInsPoints, isNewAccount } = req.body; 
    if (mentorStatus !== undefined) user.mentorStatus = mentorStatus; 
    if (fitnessPoints !== undefined) user.fitnessPoints = fitnessPoints; 
    if (videoGamesPoints !== undefined) user.videoGamesPoints = videoGamesPoints; 
    if (boardGamesPoints !== undefined) user.boardGamesPoints = boardGamesPoints; 
    if (musicInsPoints !== undefined) user.musicInsPoints = musicInsPoints; 
    if (isNewAccount !== undefined) user.isNewAccount = isNewAccount;

    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
