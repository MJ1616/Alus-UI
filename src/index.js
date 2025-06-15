import React from 'react';
import ReactDOM from 'react-dom/client';
import SchedulePlanner from './SchedulePlanner';
import './main.css'; // or './index.css' for your own styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SchedulePlanner />
  </React.StrictMode>
);
