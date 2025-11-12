// routes/teacher.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const AttendanceSession = require('../models/AttendanceSession');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { verifyToken, isTeacher } = require('../middleware/auth');

// Apply middleware to all routes in this file
router.use(verifyToken, isTeacher);

// @route   POST api/teacher/add-student
// @desc    Add a new student, generate password, and send email
router.post('/add-student', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ msg: 'Please provide name and email' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'A user with this email already exists' });
    }

    // Generate a random, temporary password
    const temporaryPassword = crypto.randomBytes(8).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
    });

    await user.save();

    // Send the welcome email with credentials
    const message = `Welcome to the Attendance System!\n\nYou have been added as a student by your teacher.\n\nYour login credentials are:\nEmail: ${email}\nPassword: ${temporaryPassword}\n\nPlease change your password after your first login.`;

    await sendEmail({
      email: user.email,
      subject: 'Your Account Credentials for the Attendance System',
      message,
    });

    res.status(201).json({ msg: 'Student created successfully and email sent.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   GET api/teacher/students
// @desc    Get all students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/teacher/attendance
// @desc    Get all attendance records for all students
router.get('/attendance', async (req, res) => {
  try {
    const records = await Attendance.find().populate('studentId', 'name email').sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// routes/teacher.js
// ... (keep all the existing code for add-student, students, and the old /attendance route)

// @route   GET api/teacher/attendance-summary
// @desc    Get a summary of attendance grouped by subject
router.get('/attendance-summary', async (req, res) => {
    try {
        // Step 1: Get all subjects to ensure we list every subject, even those with 0 classes
        const allSubjects = await Subject.find({ teacherId: req.user.id });

        // Step 2: Aggregate the total number of sessions (classes) held for each subject
        const totalSessions = await AttendanceSession.aggregate([
            { $match: { teacherId: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: {
                _id: "$subjectId",
                totalClasses: { $sum: 1 }
            }}
        ]);

        // Step 3: Aggregate the total number of 'present' marks for each subject
        const totalPresents = await Attendance.aggregate([
            {
                // We need to join with sessions to ensure we only count attendance for this teacher
                $lookup: {
                    from: "attendancesessions",
                    localField: "sessionId",
                    foreignField: "_id",
                    as: "session"
                }
            },
            { $unwind: "$session" },
            { $match: { "session.teacherId": new mongoose.Types.ObjectId(req.user.id), "status": "present" } },
            { $group: {
                _id: "$subjectId",
                totalAttendance: { $sum: 1 }
            }}
        ]);
        
        // Step 4: Combine the data into a clean summary
        const summary = allSubjects.map(subject => {
            const subjectSessions = totalSessions.find(s => s._id.equals(subject._id));
            const subjectPresents = totalPresents.find(p => p._id.equals(subject._id));

            return {
                subjectId: subject._id,
                subjectName: subject.name,
                totalClasses: subjectSessions ? subjectSessions.totalClasses : 0,
                totalAttendance: subjectPresents ? subjectPresents.totalAttendance : 0,
            };
        });

        res.json(summary);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// routes/teacher.js
// ... (keep all the existing code for add-student, students, attendance-summary etc.)

// @route   GET api/teacher/attendance/:subjectId
// @desc    Get all attendance records for a specific subject, grouped by date
router.get('/attendance/:subjectId', async (req, res) => {
    try {
        const { subjectId } = req.params;

        const attendanceRecords = await Attendance.find({ 
            subjectId: new mongoose.Types.ObjectId(subjectId) 
        })
        .populate('studentId', 'name')
        .populate('sessionId', 'date')
        .sort({ date: -1 });

        // Group records by session/date for a cleaner view
        const groupedByDate = attendanceRecords.reduce((acc, record) => {
            const date = new Date(record.date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(record.studentId.name);
            return acc;
        }, {});

        res.json(groupedByDate);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;