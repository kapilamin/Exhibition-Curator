import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import Exhibition from './pages/Exhibition';
import GlobalStyle from './styles/GlobalStyle';


function App() {
  return (
    <Router>
       <GlobalStyle />
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route exact path="/" component={Home} />
            <Route path="/search" component={Search} />
            <Route path="/exhibition" component={Exhibition} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
