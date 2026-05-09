import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useAdminAuth } from './context/AdminAuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SemesterResults from './pages/SemesterResults';
import AssessmentMarks from './pages/AssessmentMarks';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

const AdminProtectedRoute = ({ children }) => {
  const { adminUser } = useAdminAuth();
  if (!adminUser) return <Navigate to="/login" />;
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Student Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/semesters" element={<ProtectedRoute><SemesterResults /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><AssessmentMarks /></ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

