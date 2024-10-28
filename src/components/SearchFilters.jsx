import React from 'react';

const SearchFilters = ({ filters, setFilters }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6" role="region" aria-label="Search filters">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Source Filter */}
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
            Museum Source
          </label>
          <select
            id="source"
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
          >
            <option value="all">All Museums</option>
            <option value="met">Metropolitan Museum</option>
            <option value="harvard">Harvard Museums</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
          >
            <option value="title">Title (A-Z)</option>
            <option value="artist">Artist Name</option>
            <option value="dateAsc">Date (Oldest First)</option>
            <option value="dateDesc">Date (Newest First)</option>
          </select>
        </div>

        {/* Time Period Filter */}
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
            Time Period
          </label>
          <select
            id="period"
            value={filters.period}
            onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
          >
            <option value="all">All Periods</option>
            <option value="ancient">Ancient (Before 500 CE)</option>
            <option value="medieval">Medieval (500-1400)</option>
            <option value="renaissance">Renaissance (1400-1600)</option>
            <option value="modern">Modern (1600-1900)</option>
            <option value="contemporary">Contemporary (1900-Present)</option>
          </select>
        </div>

        {/* Medium Filter */}
        <div>
          <label htmlFor="medium" className="block text-sm font-medium text-gray-700 mb-2">
            Medium
          </label>
          <select
            id="medium"
            value={filters.medium}
            onChange={(e) => setFilters(prev => ({ ...prev, medium: e.target.value }))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
          >
            <option value="all">All Mediums</option>
            <option value="painting">Paintings</option>
            <option value="sculpture">Sculpture</option>
            <option value="photography">Photography</option>
            <option value="prints">Prints & Drawings</option>
            <option value="decorative">Decorative Arts</option>
          </select>
        </div>
      </div>

      {/* Additional Options */}
      <div className="mt-6 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasImage}
            onChange={(e) => setFilters(prev => ({ ...prev, hasImage: e.target.checked }))}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500
                     cursor-pointer w-4 h-4"
            id="hasImage"
          />
          <span className="text-sm text-gray-700">Show only artworks with images</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasDetails}
            onChange={(e) => setFilters(prev => ({ ...prev, hasDetails: e.target.checked }))}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500
                     cursor-pointer w-4 h-4"
            id="hasDetails"
          />
          <span className="text-sm text-gray-700">Show only artworks with detailed information</span>
        </label>
      </div>

      {/* Reset Filters Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => setFilters({
            source: 'all',
            sortBy: 'title',
            period: 'all',
            medium: 'all',
            hasImage: true,
            hasDetails: false
          })}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
          aria-label="Reset all filters to default values"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;