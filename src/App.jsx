import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppContent from './components/AppContent';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppContent />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;