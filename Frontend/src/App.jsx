import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SemesterResults from './pages/SemesterResults';
import RankList from './pages/RankList';
import AssessmentMarks from './pages/AssessmentMarks';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/semesters" element={<ProtectedRoute><SemesterResults /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><AssessmentMarks /></ProtectedRoute>} />
        <Route path="/rank-list" element={<ProtectedRoute><RankList /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
