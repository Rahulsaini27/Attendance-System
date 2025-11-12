// routes/attendance.js
const express =require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const Subject = require('../models/Subject');
const { verifyToken } = require('../middleware/auth');
const mongoose = require('mongoose');

// @route   POST api/attendance/mark
// @desc    Mark attendance for a subject in an active session
router.post('/mark', verifyToken, async (req, res) => {
  const { sessionId, subjectId } = req.body;
  
  try {
    const session = await AttendanceSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ msg: 'Session not found.' });
    }
    if (!session.isActive) {
      return res.status(400).json({ msg: 'You are late. The attendance session has ended.' });
    }

    // Check if attendance already marked for this session
    const existingAttendance = await Attendance.findOne({ studentId: req.user.id, sessionId });
    if (existingAttendance) {
      return res.status(400).json({ msg: 'You have already marked your attendance for this class.' });
    }

    const newAttendance = new Attendance({
      studentId: req.user.id,
      sessionId,
      subjectId,
      date: new Date(),
      status: 'present',
    });

    await newAttendance.save();
    res.status(201).json({ msg: 'Attendance marked successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/attendance/summary
// @desc    Get subject-wise attendance summary for the logged-in student
router.get('/summary', verifyToken, async (req, res) => {
    try {
        const studentId = new mongoose.Types.ObjectId(req.user.id);

        // 1. Get all subjects
        const allSubjects = await Subject.find({});
        if (allSubjects.length === 0) {
            return res.json([]);
        }

        // 2. Aggregate total classes (sessions) for each subject
        const totalClasses = await AttendanceSession.aggregate([
            { $group: { _id: "$subjectId", total: { $sum: 1 } } }
        ]);

        // 3. Aggregate present classes for the student for each subject
        const presentClasses = await Attendance.aggregate([
            { $match: { studentId: studentId, status: 'present' } },
            { $group: { _id: "$subjectId", present: { $sum: 1 } } }
        ]);

        // 4. Map results together
        const summary = allSubjects.map(subject => {
            const total = totalClasses.find(tc => tc._id.equals(subject._id));
            const present = presentClasses.find(pc => pc._id.equals(subject._id));
            
            const totalCount = total ? total.total : 0;
            const presentCount = present ? present.present : 0;
            
            return {
                subjectId: subject._id,
                subjectName: subject.name,
                totalClasses: totalCount,
                presentClasses: presentCount,
                absentClasses: totalCount - presentCount,
                attendancePercentage: totalCount > 0 ? (presentCount / totalCount) * 100 : 0,
            };
        });

        // Calculate overall stats
        const overallTotal = summary.reduce((sum, s) => sum + s.totalClasses, 0);
        const overallPresent = summary.reduce((sum, s) => sum + s.presentClasses, 0);
        const overallPercentage = overallTotal > 0 ? (overallPresent / overallTotal) * 100 : 0;

        res.json({
            bySubject: summary,
            overall: {
                totalClasses: overallTotal,
                attended: overallPresent,
                percentage: overallPercentage,
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// routes/attendance.js
// ... (keep existing /mark and /summary routes)

// @route   GET api/attendance/today
// @desc    Get all of a student's attendance records for the current day
router.get('/today', verifyToken, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const records = await Attendance.find({
      studentId: req.user.id,
      date: { $gte: startOfDay, $lt: endOfDay },
    }).select('sessionId'); // We only need the session ID

    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;