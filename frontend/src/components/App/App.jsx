import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from '../../pages/IndexPage/IndexPage';
import { SessionProvider } from '../../context/SessionContext';

function App() {
  return (
    <SessionProvider>
      <Router>

        <Routes>
          <Route path="/" element={<IndexPage />} />
        </Routes>

      </Router>
    </SessionProvider>
  );
}

export default App;
