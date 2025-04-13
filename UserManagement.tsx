import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Switch,
  FormControlLabel,
  Tabs,
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    badgeNumber: '',
    phoneNumber: '',
    rank: 'constable',
    role: 'officer',
    department: '',
    status: 'active'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real implementation, these would be actual API calls
        // For the prototype, we'll simulate the data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUsers([
          { id: '1', firstName: 'John', lastName: 'Smith', email: 'john.smith@jcf.gov.jm', username: 'jsmith', badgeNumber: 'JCF1001', phoneNumber: '876-555-1001', rank: 'constable', role: 'officer', department: 'Kingston Central', status: 'active', lastLogin: '2025-04-11 08:30' },
          { id: '2', firstName: 'Sarah', lastName: 'Williams', email: 'sarah.williams@jcf.gov.jm', username: 'swilliams', badgeNumber: 'JCF1004', phoneNumber: '876-555-1004', rank: 'constable', role: 'officer', department: 'Kingston Central', status: 'active', lastLogin: '2025-04-11 09:15' },
          { id: '3', firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@jcf.gov.jm', username: 'mbrown', badgeNumber: 'JCF1008', phoneNumber: '876-555-1008', rank: 'corporal', role: 'officer', department: 'St. Andrew North', status: 'active', lastLogin: '2025-04-10 16:45' },
          { id: '4', firstName: 'Lisa', lastName: 'Johnson', email: 'lisa.johnson@jcf.gov.jm', username: 'ljohnson', badgeNumber: 'JCF1015', phoneNumber: '876-555-1015', rank: 'constable', role: 'officer', department: 'St. Andrew North', status: 'active', lastLogin: '2025-04-11 07:50' },
          { id: '5', firstName: 'Robert', lastName: 'Davis', email: 'robert.davis@jcf.gov.jm', username: 'rdavis', badgeNumber: 'JCF1023', phoneNumber: '876-555-1023', rank: 'sergeant', role: 'supervisor', department: 'St. Catherine North', status: 'active', lastLogin: '2025-04-11 08:10' },
          { id: '6', firstName: 'Emily', lastName: 'Wilson', email: 'emily.wilson@jcf.gov.jm', username: 'ewilson', badgeNumber: 'JCF1025', phoneNumber: '876-555-1025', rank: 'constable', role: 'officer', department: 'Kingston Central', status: 'inactive', lastLogin: '2025-04-05 14:20' },
          { id: '7', firstName: 'James', lastName: 'Taylor', email: 'james.taylor@jcf.gov.jm', username: 'jtaylor', badgeNumber: 'JCF1030', phoneNumber: '876-555-1030', rank: 'inspector', role: 'supervisor', department: 'Kingston Central', status: 'active', lastLogin: '2025-04-11 10:05' },
          { id: '8', firstName: 'Admin', lastName: 'User', email: 'admin@jcf.gov.jm', username: 'admin', badgeNumber: 'JCF1000', phoneNumber: '876-555-1000', rank: 'superintendent', role: 'admin', department: 'Headquarters', status: 'active', lastLogin: '2025-04-11 09:30' }
        ]);
        
        setDepartments([
          { id: '1', name: 'Kingston Central', location: 'Kingston' },
          { id: '2', name: 'St. Andrew North', location: 'St. Andrew' },
          { id: '3', name: 'St. Catherine North', location: 'St. Catherine' },
          { id: '4', name: 'Headquarters', location: 'Kingston' }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (user: any = null) => {
    if (user) {
      // Edit existing user
      setSelectedUser(user);
      setUserFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        password: '',
        confirmPassword: '',
        badgeNumber: user.badgeNumber,
        phoneNumber: user.phoneNumber,
        rank: user.rank,
        role: user.role,
        department: user.department,
        status: user.status
      });
    } else {
      // Create new user
      setSelectedUser(null);
      setUserFormData({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        badgeNumber: '',
        phoneNumber: '',
        rank: 'constable',
        role: 'officer',
        department: '',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name as string]: value
    });
  };

  const handleSubmit = () => {
    // In a real implementation, this would send data to the API
    console.log('Submitting user:', userFormData);
    handleCloseDialog();
  };

  const handleDeleteUser = (userId: string) => {
    // In a real implementation, this would send a delete request to the API
    console.log('Deleting user with ID:', userId);
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    // In a real implementation, this would update the user's status in the API
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log('Toggling user status:', { userId, newStatus });
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'error';
      case 'supervisor': return 'warning';
      case 'officer': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          User Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<PersonAddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="user management tabs">
          <Tab label="All Users" />
          <Tab label="Officers" />
          <Tab label="Supervisors" />
          <Tab label="Administrators" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Badge Number</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: getRoleColor(user.role) + '.main' }}>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.badgeNumber}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                      color={getRoleColor(user.role)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={user.status === 'active'} 
                          onChange={() => handleToggleStatus(user.id, user.status)}
                          color="success"
                          size="small"
                        />
                      }
                      label={user.status === 'active' ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="officers table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Badge Number</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.filter(user => user.role === 'officer').map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.badgeNumber}</TableCell>
                  <TableCell>{user.rank.charAt(0).toUpperCase() + user.rank.slice(1)}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status === 'active' ? 'Active' : 'Inactive'} 
                      color={user.status === 'active' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" onClick={() => handleOpenDialog(user)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="supervisors table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Badge Number</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.filter(user => user.role === 'supervisor').map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'warning.main' }}>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.badgeNumber}</TableCell>
                  <TableCell>{user.rank.charAt(0).toUpperCase() + user.rank.slice(1)}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status === 'active' ? 'Active' : 'Inactive'} 
                      color={user.status === 'active' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" onClick={() => handleOpenDialog(user)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="administrators table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Badge Number</TableCell>
 
(Content truncated due to size limit. Use line ranges to read in chunks)