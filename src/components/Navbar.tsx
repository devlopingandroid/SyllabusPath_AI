import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <BookOpen className="w-8 h-8 text-blue-600 group-hover:text-cyan-500 transition-colors" />
            <span className="text-xl font-bold text-gray-900">SyllabusPath AI</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/analytics"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Analytics
                </Link>
                <Link
                  to="/progress"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Progress
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
