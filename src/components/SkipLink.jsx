import React from 'react';

const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 
                 focus:bg-white focus:text-purple-600 focus:p-4 focus:m-4 focus:rounded-lg
                 focus:shadow-lg focus:ring-2 focus:ring-purple-500"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;