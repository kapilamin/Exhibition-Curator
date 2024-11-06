import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExhibitionProvider } from './contexts/ExhibitionContext';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import Exhibition from './pages/Exhibition';
import ArtworkViewer from './components/ArtworkViewer';
import Footer from './components/Footer';
import { ToastProvider } from './contexts/ToastContext';



const App = () => {
  return (
    <Router>
      <ToastProvider>
      <ExhibitionProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/exhibition" element={<Exhibition />} />
              <Route path="/artwork/:source/:id" element={<ArtworkViewer />} />
              {/* Add a catch-all route */}
              <Route path="*" element={
                <div className="container mx-auto px-4 py-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
                  <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </ExhibitionProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;