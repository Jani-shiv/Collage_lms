# College Learning Management System (LMS)

A full-stack Learning Management System built with React, Node.js, Express, MySQL, and Sequelize. This system provides role-based access for students, teachers, and administrators to manage courses, assignments, and academic activities.

## 🚀 Features

### For Students
- **Dashboard**: View enrolled courses, assignments, and academic progress
- **Course Enrollment**: Browse and enroll in available courses
- **Assignment Submission**: Submit assignments and view grades
- **Profile Management**: Update personal information and change password

### For Teachers
- **Course Management**: Create and manage courses
- **Student Management**: View enrolled students and track progress
- **Assignment Creation**: Create and grade assignments
- **Grade Management**: Assign grades and provide feedback

### For Administrators
- **User Management**: Create, update, and delete user accounts
- **Course Oversight**: Monitor all courses and enrollments
- **System Analytics**: View system-wide statistics and reports
- **Role Management**: Assign and modify user roles

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📁 Project Structure

\`\`\`
college-lms/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── models/
│   │   ├── index.js             # Model associations
│   │   ├── User.js              # User model
│   │   ├── Course.js            # Course model
│   │   ├── Enrollment.js        # Enrollment model
│   │   ├── Assignment.js        # Assignment model
│   │   └── Submission.js        # Submission model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── users.js             # User management routes
│   │   └── courses.js           # Course management routes
│   ├── seeders/
│   │   └── seed.js              # Database seeder
│   ├── utils/
│   │   └── validation.js        # Input validation schemas
│   ├── .env.example             # Environment variables template
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express server
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx           # Navigation component
    │   │   ├── ProtectedRoute.jsx   # Route protection
    │   │   ├── LoadingSpinner.jsx   # Loading indicator
    │   │   └── CreateCourseModal.jsx # Course creation modal
    │   ├── context/
    │   │   └── AuthContext.jsx      # Authentication context
    │   ├── pages/
    │   │   ├── Login.jsx            # Login page
    │   │   ├── Signup.jsx           # Registration page
    │   │   ├── StudentDashboard.jsx # Student dashboard
    │   │   ├── TeacherDashboard.jsx # Teacher dashboard
    │   │   └── AdminDashboard.jsx   # Admin dashboard
    │   ├── services/
    │   │   └── api.js               # API service layer
    │   ├── App.jsx                  # Main app component
    │   ├── main.jsx                 # App entry point
    │   └── index.css                # Global styles
    ├── .env.example                 # Frontend environment template
    ├── package.json                 # Frontend dependencies
    ├── tailwind.config.js           # Tailwind configuration
    └── vite.config.js               # Vite configuration
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd college-lms
   \`\`\`

2. **Setup Backend**
   \`\`\`bash
   cd backend
   npm install
   
   # Copy environment file and configure
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Create database
   mysql -u root -p
   CREATE DATABASE college_lms;
   exit
   
   # Run database migrations and seed data
   npm run seed
   
   # Start backend server
   npm run dev
   \`\`\`

3. **Setup Frontend**
   \`\`\`bash
   cd ../frontend
   npm install
   
   # Copy environment file
   cp .env.example .env
   # Edit .env if needed (default backend URL is already set)
   
   # Start frontend development server
   npm run dev
   \`\`\`

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Demo Accounts

After running the seeder, you can use these demo accounts:

- **Admin**: admin@college.edu / password123
- **Teacher**: teacher@college.edu / password123  
- **Student**: student@college.edu / password123

## 🔧 Configuration

### Backend Environment Variables (.env)
\`\`\`env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=college_lms
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
\`\`\`

### Frontend Environment Variables (.env)
\`\`\`env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_APP_NAME=College LMS
\`\`\`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### User Management (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Course Management
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Teacher/Admin)
- `POST /api/courses/:id/enroll` - Enroll in course (Student)

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Role-based Access Control** - Different permissions for each user role
- **Input Validation** - Joi validation for all API inputs
- **CORS Protection** - Configured for secure cross-origin requests
- **SQL Injection Prevention** - Sequelize ORM with parameterized queries

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Role-based Dashboards** - Customized interface for each user type
- **Real-time Notifications** - Toast notifications for user feedback
- **Loading States** - Smooth loading indicators
- **Form Validation** - Client-side and server-side validation
- **Accessible Design** - ARIA labels and keyboard navigation

## 🧪 Testing

### Backend Testing
\`\`\`bash
cd backend
npm test
\`\`\`

### Frontend Testing
\`\`\`bash
cd frontend
npm test
\`\`\`

## 📦 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred platform (Heroku, AWS, etc.)
3. Ensure database is accessible from production environment

### Frontend Deployment
1. Build the production bundle:
   \`\`\`bash
   npm run build
   \`\`\`
2. Deploy the `dist` folder to your hosting platform (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- [ ] Real-time chat system
- [ ] Video conferencing integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] File upload system
- [ ] Calendar integration
- [ ] Grade book export
- [ ] Multi-language support
- [ ] Dark mode theme

---

**Happy Learning! 🎓**
