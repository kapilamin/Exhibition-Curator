import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Exhibition Curator</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/exhibition">My Exhibition</Link>
      </nav>
    </header>
  );
};

export default Header;