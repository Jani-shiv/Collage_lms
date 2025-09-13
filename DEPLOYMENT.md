# College LMS Deployment Guide

## Overview
This document provides deployment instructions for the College Learning Management System.

## Features
- **User Authentication**: Login/logout with JWT tokens
- **Role-based Access**: Admin, Teacher, and Student roles
- **Course Management**: Create, view, and manage courses
- **Assignment System**: Create and submit assignments
- **Modern UI**: Built with React and Tailwind CSS

## Quick Start
1. **One Command Setup**: `npm start`
2. **Access the Application**: Open http://localhost:3000
3. **Backend API**: Available at http://localhost:5000

## Demo Accounts
- **Admin**: admin@example.com / admin123
- **Teacher**: teacher@example.com / teacher123  
- **Student**: student@example.com / student123

## Technology Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **Authentication**: JWT + bcrypt
- **Database**: SQLite with Sequelize ORM

## Project Structure
```
college-lms/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── components/        # UI components
├── public/           # Static assets
└── start.bat/ps1     # Startup scripts
```

## Production Deployment
1. Set environment variables
2. Configure production database
3. Build frontend: `npm run build`
4. Start production server
5. Configure reverse proxy (nginx/apache)

## Support
For issues and questions, please refer to the README.md file.