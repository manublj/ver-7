import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CardsPage from './pages/CardsPage';
import { initializeSheetHeaders } from './api/googleSheetsApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize sheet headers when the app starts
    initializeSheetHeaders()
      .then(result => console.log('Sheet headers initialized:', result))
      .catch(error => console.error('Failed to initialize sheet headers:', error));
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Container fluid className="p-0 main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/wayback-machine" element={<CardsPage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;