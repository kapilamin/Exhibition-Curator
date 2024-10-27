import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-purple-800">Exhibition Curator</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/"
              className="text-gray-700 hover:text-purple-800 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/search"
              className="text-gray-700 hover:text-purple-800 transition-colors"
            >
              Search
            </Link>
            <Link 
              to="/exhibition"
              className="text-gray-700 hover:text-purple-800 transition-colors"
            >
              My Exhibition
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">
              {isMenuOpen ? 'Close menu' : 'Open menu'}
            </span>
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-800 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-800 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                to="/exhibition"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-purple-800 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                My Exhibition
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;