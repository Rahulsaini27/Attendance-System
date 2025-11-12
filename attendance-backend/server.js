// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/subjects', require('./routes/subject')); // Add this
app.use('/api/sessions', require('./routes/session')); // Add this
app.use('/api/notifications', require('./routes/notification')); // Add this line

app.get('/', (req, res) => res.send('Attendance API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));