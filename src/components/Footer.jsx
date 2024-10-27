import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Exhibition Curator</h3>
            <p className="text-sm text-gray-400">
              Explore and curate virtual exhibitions from the world's leading art museums.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://metmuseum.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Metropolitan Museum of Art API
                </a>
              </li>
              <li>
                <a
                  href="https://harvardartmuseums.org/collections/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Harvard Art Museums API
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Exhibition Curator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;