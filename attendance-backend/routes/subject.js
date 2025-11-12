// routes/subject.js
const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { verifyToken, isTeacher } = require('../middleware/auth');

// Middleware to protect all routes in this file
router.use(verifyToken, isTeacher);

// @route   POST api/subjects
// @desc    Create a new subject
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ msg: 'Please provide a subject name' });
  }

  try {
    const newSubject = new Subject({
      name,
      teacherId: req.user.id,
    });
    const subject = await newSubject.save();
    res.status(201).json(subject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/subjects/my-subjects
// @desc    Get all subjects created by the logged-in teacher
router.get('/my-subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;