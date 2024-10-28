import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Share2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
     {/* Hero Section */}
     <section
  className="bg-cover bg-center h-screen flex items-center justify-center"
  style={{ backgroundImage: "url('https://helloartsy.com/wp-content/uploads/kids/places/how-to-draw-a-museum/how-to-draw-a-museum-step-9.jpg')" }}
>
  <div className="text-center bg-black bg-opacity-60 p-8 rounded-lg max-w-lg">
    <h1 className="text-5xl font-bold text-white mb-6">
      Welcome to Exhibition Curator
    </h1>
    <p className="text-xl text-gray-300 mb-6">
      Create your own virtual art exhibition from world-renowned museums. Discover, curate, and share your favorite artworks from the Metropolitan Museum of Art and Harvard Art Museums.
    </p>
<button className="px-6 py-3 text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-transform transform hover:scale-105 rounded-lg shadow-lg">
  Start Curating
</button>

  </div>
</section>


      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Experience art curation in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-600">
                Search through thousands of artworks from leading museums around the world
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <PlusCircle className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curate</h3>
              <p className="text-gray-600">
                Select your favorite pieces and organize them into your personal exhibition
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Share2 className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share</h3>
              <p className="text-gray-600">
                Share your curated exhibition with friends and art enthusiasts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Museums Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Collections</h2>
            <p className="text-xl text-gray-600">Explore artworks from these prestigious institutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a 
              href="https://www.metmuseum.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Metropolitan Museum of Art</h3>
                <p className="text-gray-600 mb-4">
                  Access over 500,000 artworks from one of the world's largest art museums
                </p>
                <span className="text-purple-600 group-hover:text-purple-700">Learn more →</span>
              </div>
            </a>

            <a 
              href="https://harvardartmuseums.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Harvard Art Museums</h3>
                <p className="text-gray-600 mb-4">
                  Explore the combined collections of three museums in one location
                </p>
                <span className="text-purple-600 group-hover:text-purple-700">Learn more →</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Curating?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Begin your journey as an art curator today
          </p>
          <Link
            to="/search"
            className="inline-flex items-center px-8 py-3 border-2 border-white text-lg font-medium rounded-md 
                      text-white hover:bg-white hover:text-purple-900 transition-colors duration-200"
          >
            Start Exploring
            <Search className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;