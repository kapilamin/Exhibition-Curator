import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ExhibitionProvider } from './contexts/ExhibitionContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Exhibition from './pages/Exhibition';

function App() {
  return (
    <ExhibitionProvider>
        <Router>
        <div className="App">
            <header>
            <h1>Exhibition Curator</h1>
            <nav>
                <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/exhibition">My Exhibition</Link></li>
                </ul>
            </nav>
            </header>

            <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/exhibition" element={<Exhibition />} />
            </Routes>
            </main>

            <footer>
            <p>&copy; 2024 Exhibition Curator. All rights reserved.</p>
            </footer>
        </div>
        </Router>
    </ExhibitionProvider>
  );
}

export default App;