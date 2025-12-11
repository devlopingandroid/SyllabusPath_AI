import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">SyllabusPath AI</span>
          </div>

          <div className="text-gray-600 text-sm">
            © 2025 SyllabusPath AI. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
