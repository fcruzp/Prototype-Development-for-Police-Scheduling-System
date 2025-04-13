import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Auth Components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Layout Components
import AdminLayout from './layouts/AdminLayout';
import OfficerLayout from './layouts/OfficerLayout';
import SupervisorLayout from './layouts/SupervisorLayout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';

// Supervisor Pages
import SupervisorDashboard from './pages/supervisor/Dashboard';
import ShiftManagement from './pages/supervisor/ShiftManagement';
import TaskManagement from './pages/supervisor/TaskManagement';
import OfficerTracking from './pages/supervisor/OfficerTracking';
import Reports from './pages/supervisor/Reports';

// Officer Pages
import OfficerDashboard from './pages/officer/Dashboard';
import MyShifts from './pages/officer/MyShifts';
import MyTasks from './pages/officer/MyTasks';
import Attendance from './pages/officer/Attendance';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Auth Guard
import PrivateRoute from './components/auth/PrivateRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep blue
    },
    secondary: {
      main: '#ff6f00', // Amber
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="departments" element={<DepartmentManagement />} />
            </Route>
            
            {/* Supervisor Routes */}
            <Route path="/supervisor" element={
              <PrivateRoute requiredRole="supervisor">
                <SupervisorLayout />
              </PrivateRoute>
            }>
              <Route index element={<SupervisorDashboard />} />
              <Route path="shifts" element={<ShiftManagement />} />
              <Route path="tasks" element={<TaskManagement />} />
              <Route path="tracking" element={<OfficerTracking />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            
            {/* Officer Routes */}
            <Route path="/officer" element={
              <PrivateRoute requiredRole="officer">
                <OfficerLayout />
              </PrivateRoute>
            }>
              <Route index element={<OfficerDashboard />} />
              <Route path="shifts" element={<MyShifts />} />
              <Route path="tasks" element={<MyTasks />} />
              <Route path="attendance" element={<Attendance />} />
            </Route>
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
