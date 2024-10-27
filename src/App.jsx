import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExhibitionProvider } from './contexts/ExhibitionContext';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import Exhibition from './pages/Exhibition';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <ExhibitionProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pt-16"> {/* Add padding-top to account for fixed header */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/exhibition" element={<Exhibition />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ExhibitionProvider>
    </Router>
  );
};

export default App;