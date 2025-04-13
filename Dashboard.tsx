import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDepartments: 0,
    totalShifts: 0,
    totalTasks: 0,
    activeUsers: 0,
    pendingTasks: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, these would be actual API calls
        // For the prototype, we'll simulate the data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalUsers: 156,
          totalDepartments: 12,
          totalShifts: 48,
          totalTasks: 237,
          activeUsers: 142,
          pendingTasks: 45
        });
        
        setRecentUsers([
          { _id: '1', firstName: 'John', lastName: 'Smith', role: 'officer', badgeNumber: 'JCF1001', department: 'Kingston Central', status: 'active' },
          { _id: '2', firstName: 'Maria', lastName: 'Johnson', role: 'supervisor', badgeNumber: 'JCF1002', department: 'St. Andrew North', status: 'active' },
          { _id: '3', firstName: 'Robert', lastName: 'Brown', role: 'officer', badgeNumber: 'JCF1003', department: 'St. Catherine North', status: 'inactive' },
          { _id: '4', firstName: 'Sarah', lastName: 'Williams', role: 'officer', badgeNumber: 'JCF1004', department: 'Kingston Central', status: 'active' },
          { _id: '5', firstName: 'Michael', lastName: 'Davis', role: 'supervisor', badgeNumber: 'JCF1005', department: 'St. James', status: 'active' }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Welcome back, {user?.firstName}! Here's an overview of the system.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {stats.totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.activeUsers} active
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <PeopleIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Departments
                </Typography>
                <Typography variant="h4">
                  {stats.totalDepartments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Across Jamaica
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                <BusinessIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Active Shifts
                </Typography>
                <Typography variant="h4">
                  {stats.totalShifts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Currently scheduled
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <CalendarMonthIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Tasks
                </Typography>
                <Typography variant="h4">
                  {stats.totalTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.pendingTasks} pending
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <AssignmentIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Users */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recently Added Users
            </Typography>
            <List>
              {recentUsers.map((user, index) => (
                <React.Fragment key={user._id}>
                  <ListItem alignItems="flex-start">
                    <Avatar sx={{ mr: 2, bgcolor: user.role === 'supervisor' ? 'secondary.main' : 'primary.main' }}>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={user.status} 
                            color={user.status === 'active' ? 'success' : 'default'}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {user.badgeNumber}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            {user.department}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentUsers.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" size="small">
                View All Users
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" paragraph>
                The Jamaica Constabulary Force Workforce Management System is currently operational across all departments.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Last system update: April 11, 2025 at 08:30 AM
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  System Health
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip label="Backend Services" color="success" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    All services operational
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip label="Database" color="success" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Connected and optimized
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip label="Geolocation Services" color="success" size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Tracking enabled
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
