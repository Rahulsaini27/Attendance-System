# MERN Stack & React Native Attendance System

A modern, full-stack, subject-wise attendance management system built for educational institutions. This application provides a seamless experience for both teachers and students with role-based access and real-time functionality.

The project is comprised of a **React Native (Expo)** mobile application for the frontend and a robust **Node.js, Express, and MongoDB (MERN)** stack for the backend.

## Core Features

### Teacher Portal
-   **Secure Login:** Role-based authentication.
-   **Subject Management:** Create and manage subjects for their classes.
-   **Session Control:** Start and stop attendance sessions for any subject in real-time.
-   **Live Attendance Tracking:** View a list of students as they mark their attendance during an active session.
-   **Student Management:** Add new students to the system (credentials are automatically emailed).
-   **Attendance Summary:** View a high-level, subject-wise summary of all classes held and total attendance marks.
-   **Detailed Attendee Lists:** Drill down from the summary to see exactly who attended on which date for a specific subject.

### Student Portal
-   **Secure Login:** Receive credentials via email and log in.
-   **Dashboard:** A beautiful dashboard with an overview of their overall attendance percentage.
-   **Live Class Listing:** See classes that are currently active and available for attendance marking.
-   **One-Tap Attendance:** Mark attendance for active sessions. The system prevents duplicate marking.
-   **Subject-wise Summary:** View a detailed breakdown of their attendance percentage for each subject, complete with progress bars.
-   **Notification System:** Receive notifications when a class starts or when they have missed marking attendance for a class that has ended.

## Screenshots

*(It is highly recommended to add screenshots of your application here. Replace these placeholders with your own images.)*

| Login Screen | Student Dashboard | Attendance by Subject |
| :----------: | :---------------: | :-------------------: |
| [Login_Screen.png] | [Student_Dashboard.png] | [Attendance_Summary.png] |

| Teacher Dashboard | Active Session | Notifications |
| :---------------: | :--------------: | :-------------: |
| [Teacher_Dashboard.png] | [Active_Session.png] | [Notifications.png] |


## Tech Stack

### Backend
-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Web framework for Node.js.
-   **MongoDB:** NoSQL database for storing user, subject, and attendance data.
-   **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
-   **JSON Web Tokens (JWT):** For secure user authentication.
-   **Bcrypt.js:** For password hashing.
-   **Nodemailer:** For sending emails with student credentials.
-   **Dotenv:** For managing environment variables.

### Frontend
-   **React Native (Expo):** Framework for building native mobile apps.
-   **React Navigation:** For handling routing and navigation between screens.
-   **Axios:** For making HTTP requests to the backend API.
-   **Expo Linear Gradient:** For beautiful gradient backgrounds.
-   **React Native Vector Icons:** For icon sets.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:
-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   NPM or Yarn package manager
-   [MongoDB](https://www.mongodb.com/try/download/community) installed locally or a free MongoDB Atlas cluster.
-   An IDE like [VS Code](https://code.visualstudio.com/)
-   [Expo Go](https://expo.dev/client) app on your physical device or an Android/iOS simulator.
-   [Postman](https://www.postman.com/downloads/) (Optional, for testing the backend API).

---

## Setup and Installation

### 1. Backend Setup

```bash
# 1. Navigate to the backend directory
cd attendance-backend

# 2. Install all required dependencies
npm install

# 3. Create a .env file in the root of the backend folder
#    Copy the contents of .env.example (if provided) or use the template below
touch .env