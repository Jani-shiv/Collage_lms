# College LMS - Quick Start Guide

## 🚀 One-Command Startup

You can now start the entire College LMS with just **ONE COMMAND**!

### Option 1: Using npm (Recommended)
```bash
npm start
```

### Option 2: Using Batch File (Windows)
Double-click `start.bat` or run:
```cmd
start.bat
```

### Option 3: Using PowerShell Script
```powershell
./start.ps1
```

## 📋 What Each Method Does

All methods will:
1. ✅ Stop any existing Node.js processes
2. ✅ Start the backend server (http://localhost:5000)
3. ✅ Start the frontend server (http://localhost:3000)
4. ✅ Display login credentials
5. ✅ Optionally open the website in your browser

## 🎓 Demo Accounts

- **Admin**: `admin@college.edu` / `password123`
- **Teacher**: `teacher@college.edu` / `password123`
- **Student**: `student@college.edu` / `password123`

## 🛠️ Other Useful Commands

```bash
# Install all dependencies for frontend and backend
npm run install:all

# Run database seeder
npm run seed

# Build frontend for production
npm run build

# Start only backend
npm run start:backend

# Start only frontend
npm run start:frontend
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔧 Troubleshooting

If you encounter any issues:

1. **Port already in use**: Kill Node.js processes or restart your computer
2. **Permission errors**: Run PowerShell as Administrator
3. **Dependencies missing**: Run `npm run install:all`

## 📁 Project Structure

```
college-lms/
├── start.bat           # Windows batch startup script
├── start.ps1           # PowerShell startup script
├── package.json        # Root package.json with startup scripts
├── backend/            # Express.js backend server
│   ├── server.js
│   ├── database/
│   └── ...
└── frontend/           # React frontend application
    ├── src/
    └── ...
```

**Happy Learning! 🎓**