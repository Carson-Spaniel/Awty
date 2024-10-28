import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Create a root element for the React app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component within that root
root.render(<App />);