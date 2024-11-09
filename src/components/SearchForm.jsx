import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const SearchForm = ({ onSearch, isLoading, initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search artworks, artists, or periods..."
            disabled={isLoading}
            className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     placeholder-gray-400 text-gray-900"
          />
          <SearchIcon 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !searchTerm.trim()}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium
                   hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                   disabled:bg-purple-300 disabled:cursor-not-allowed
                   transition-colors duration-200
                   min-w-[120px]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            'Search'
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;