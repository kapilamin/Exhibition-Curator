import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ExhibitionProvider } from './contexts/ExhibitionContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Exhibition from './pages/Exhibition';
import ArtworkViewer from './components/ArtworkViewer';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <ExhibitionProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/exhibition" element={<Exhibition />} />
              <Route path="/artwork/:source/:id" element={<ArtworkViewer />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ExhibitionProvider>
  );
}

export default App;
