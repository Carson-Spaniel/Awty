import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Welcome to Trip Planner</h1>
        <p className="lead">Plan and manage your trips with ease!</p>
        <Link className="btn btn-primary btn-lg" to="/trips">View Trips</Link>
      </div>
    </div>
  );
}

export default Home;
