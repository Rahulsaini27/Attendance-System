// routes/session.js
const express = require('express');
const router = express.Router();
const AttendanceSession = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const User = require('../models/User'); // Import User model
const Notification = require('../models/Notification'); // Import Notification model
const { verifyToken, isTeacher } = require('../middleware/auth');

// @route   POST api/sessions/start
// @desc    Start an attendance session and notify all students
router.post('/start', [verifyToken, isTeacher], async (req, res) => {
  const { subjectId } = req.body;
  try {
    const existingActiveSession = await AttendanceSession.findOne({ teacherId: req.user.id, isActive: true });
    if (existingActiveSession) {
      return res.status(400).json({ msg: 'You already have an active session.' });
    }

    const newSession = new AttendanceSession({ subjectId, teacherId: req.user.id });
    const session = await (await newSession.save()).populate('subjectId', 'name');
    
    // NOTIFICATION LOGIC: Notify all students that a class has started
    const students = await User.find({ role: 'student' });
    const notifications = students.map(student => ({
      userId: student._id,
      title: 'Class Started',
      message: `The class for "${session.subjectId.name}" has just started. Mark your attendance now!`,
    }));
    if(notifications.length > 0) await Notification.insertMany(notifications);

    res.status(201).json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/sessions/stop/:sessionId
// @desc    Stop a session and notify students who missed it
router.post('/stop/:sessionId', [verifyToken, isTeacher], async (req, res) => {
  try {
    const session = await AttendanceSession.findById(req.params.sessionId).populate('subjectId', 'name');
    if (!session) return res.status(404).json({ msg: 'Session not found' });
    if (session.teacherId.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
    
    session.isActive = false;
    session.endTime = Date.now();
    await session.save();

    // NOTIFICATION LOGIC: Find who missed the class and notify them
    const allStudents = await User.find({ role: 'student' }).select('_id');
    const attendees = await Attendance.find({ sessionId: session._id }).select('studentId');
    
    const attendeeIds = new Set(attendees.map(a => a.studentId.toString()));
    const missedStudents = allStudents.filter(s => !attendeeIds.has(s._id.toString()));

    const notifications = missedStudents.map(student => ({
      userId: student._id,
      title: 'Class Missed',
      message: `You missed the attendance for "${session.subjectId.name}".`,
    }));
    if(notifications.length > 0) await Notification.insertMany(notifications);

    res.json({ msg: 'Session stopped successfully', session });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... (keep the other routes: /active, /teacher/active, /:sessionId/attendees)
router.get('/active', verifyToken, async (req, res) => {
    try {
        const activeSessions = await AttendanceSession.find({ isActive: true }).populate('subjectId', 'name').populate('teacherId', 'name');
        res.json(activeSessions);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

router.get('/teacher/active', [verifyToken, isTeacher], async (req, res) => {
    try {
        const activeSession = await AttendanceSession.findOne({ teacherId: req.user.id, isActive: true }).populate('subjectId', 'name');
        res.json(activeSession);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});

router.get('/:sessionId/attendees', [verifyToken, isTeacher], async (req, res) => {
    try {
        const attendees = await Attendance.find({ sessionId: req.params.sessionId }).populate('studentId', 'name email');
        res.json(attendees);
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
});


module.exports = router;