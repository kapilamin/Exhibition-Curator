import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Exhibition Curator</h1>
      <p>Create your own virtual art exhibition from world-renowned museums.</p>
      <Link to="/search">Start Curating</Link>
    </div>
  );
};

export default Home;