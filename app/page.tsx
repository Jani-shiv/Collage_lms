import { BookOpen, Server, Globe, Users, GraduationCap } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">College Learning Management System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A complete full-stack LMS built with React, Node.js, Express, MySQL, and Sequelize. Features role-based
            dashboards for students, teachers, and administrators.
          </p>
        </div>

        {/* Architecture Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Frontend (React)</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• React 18 with Vite</li>
              <li>• TailwindCSS for styling</li>
              <li>• React Router for navigation</li>
              <li>• Axios for API calls</li>
              <li>• Role-based dashboards</li>
              <li>• Responsive design</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Server className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Backend (Node.js)</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• Express.js framework</li>
              <li>• Sequelize ORM</li>
              <li>• JWT authentication</li>
              <li>• bcrypt password hashing</li>
              <li>• Joi input validation</li>
              <li>• RESTful API design</li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Portal</h3>
              <p className="text-gray-600">Course enrollment, assignment submission, grade tracking</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Dashboard</h3>
              <p className="text-gray-600">Course creation, student management, assignment grading</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Panel</h3>
              <p className="text-gray-600">User management, system oversight, analytics</p>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Getting Started</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Setup Backend</h3>
              <div className="bg-gray-50 rounded p-4 font-mono text-sm">
                <div>cd backend</div>
                <div>npm install</div>
                <div>cp .env.example .env</div>
                <div># Configure your MySQL database in .env</div>
                <div>npm run seed</div>
                <div>npm run dev</div>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Setup Frontend</h3>
              <div className="bg-gray-50 rounded p-4 font-mono text-sm">
                <div>cd frontend</div>
                <div>npm install</div>
                <div>npm run dev</div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Access the Application</h3>
              <ul className="space-y-1 text-gray-600">
                <li>
                  • Frontend: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
                </li>
                <li>
                  • Backend API: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5000</code>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔑 Demo Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Administrator</h3>
              <p className="text-sm text-gray-600 mb-2">Full system access</p>
              <div className="font-mono text-sm">
                <div>admin@college.edu</div>
                <div>password123</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Teacher</h3>
              <p className="text-sm text-gray-600 mb-2">Course management</p>
              <div className="font-mono text-sm">
                <div>teacher@college.edu</div>
                <div>password123</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Student</h3>
              <p className="text-sm text-gray-600 mb-2">Course enrollment</p>
              <div className="font-mono text-sm">
                <div>student@college.edu</div>
                <div>password123</div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Structure */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📁 Project Structure</h2>
          <div className="bg-gray-50 rounded p-4 font-mono text-sm overflow-x-auto">
            <pre>{`college-lms/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── seeders/           # Database seeders
│   └── server.js          # Express server
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── services/      # API services
│   └── package.json
└── README.md              # Documentation`}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">Built with ❤️ using React, Node.js, Express, MySQL, and Sequelize</p>
        </div>
      </div>
    </div>
  )
}
