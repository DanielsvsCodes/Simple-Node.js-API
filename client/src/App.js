import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GenerateToken from './components/GenerateToken';
import Actions from './components/Actions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GenerateToken />} />
        <Route path="/actions" element={<Actions />} />
      </Routes>
    </Router>
  );
}

export default App;
