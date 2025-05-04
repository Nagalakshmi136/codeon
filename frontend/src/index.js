import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from 'react-dom/client'
import App from './App';
import './index.css';

// 1. Get the root DOM node
const container = document.getElementById('root');

// 2. Create a root
const root = createRoot(container); // Use createRoot

// 3. Render the app using the root
root.render(
  <React.StrictMode> {/* Wrap App in StrictMode (optional but recommended) */}
    <App />
  </React.StrictMode>
);