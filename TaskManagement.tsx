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
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
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

const TaskManagement: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    location: '',
    assignedTo: '',
    estimatedDuration: 60,
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        // In a real implementation, these would be actual API calls
        // For the prototype, we'll simulate the data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTasks([
          { id: '1', title: 'Traffic Control', description: 'Manage traffic flow at Half Way Tree intersection', priority: 'high', status: 'in_progress', location: 'Half Way Tree', assignedTo: 'John Smith', dueDate: '2025-04-11', estimatedDuration: 120, createdAt: '2025-04-10' },
          { id: '2', title: 'Community Outreach', description: 'Conduct community outreach program in Trench Town', priority: 'medium', status: 'pending', location: 'Trench Town', assignedTo: 'Sarah Williams', dueDate: '2025-04-12', estimatedDuration: 180, createdAt: '2025-04-10' },
          { id: '3', title: 'Patrol Downtown', description: 'Regular patrol of downtown Kingston area', priority: 'medium', status: 'assigned', location: 'Downtown Kingston', assignedTo: 'Michael Brown', dueDate: '2025-04-11', estimatedDuration: 240, createdAt: '2025-04-10' },
          { id: '4', title: 'Incident Report #JCF-2025-0423', description: 'Follow up on incident report from New Kingston', priority: 'low', status: 'completed', location: 'New Kingston', assignedTo: 'Lisa Johnson', dueDate: '2025-04-10', estimatedDuration: 60, createdAt: '2025-04-09' },
          { id: '5', title: 'Security Detail', description: 'Provide security for visiting dignitary', priority: 'high', status: 'pending', location: 'Norman Manley Airport', assignedTo: '', dueDate: '2025-04-13', estimatedDuration: 360, createdAt: '2025-04-10' }
        ]);
        
        setOfficers([
          { id: '1', name: 'John Smith', badgeNumber: 'JCF1001', rank: 'Constable', status: 'active' },
          { id: '2', name: 'Sarah Williams', badgeNumber: 'JCF1004', rank: 'Constable', status: 'active' },
          { id: '3', name: 'Michael Brown', badgeNumber: 'JCF1008', rank: 'Corporal', status: 'active' },
          { id: '4', name: 'Lisa Johnson', badgeNumber: 'JCF1015', rank: 'Constable', status: 'active' },
          { id: '5', name: 'Robert Davis', badgeNumber: 'JCF1023', rank: 'Sergeant', status: 'active' },
          { id: '6', name: 'Emily Wilson', badgeNumber: 'JCF1025', rank: 'Constable', status: 'active' },
          { id: '7', name: 'David Thompson', badgeNumber: 'JCF1032', rank: 'Constable', status: 'active' },
          { id: '8', name: 'Jennifer Lee', badgeNumber: 'JCF1036', rank: 'Corporal', status: 'active' },
          { id: '9', name: 'Thomas Anderson', badgeNumber: 'JCF1042', rank: 'Constable', status: 'active' },
          { id: '10', name: 'Jessica Martinez', badgeNumber: 'JCF1045', rank: 'Constable', status: 'active' }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task data:', error);
        setLoading(false);
      }
    };

    fetchTaskData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setTaskFormData({
      ...taskFormData,
      [name as string]: value
    });
  };

  const handleSubmit = () => {
    // In a real implementation, this would send data to the API
    console.log('Submitting task:', taskFormData);
    handleCloseDialog();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'assigned': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Task Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Create Task
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="task management tabs">
          <Tab label="All Tasks" />
          <Tab label="Pending" />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            size="small"
          >
            Filter
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tasks table">
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell component="th" scope="row">
                    {task.title}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority.toUpperCase()} 
                      color={getPriorityColor(task.priority)} 
                      size="small" 
                      icon={task.priority === 'high' ? <PriorityHighIcon /> : undefined}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {task.location}
                    </Box>
                  </TableCell>
                  <TableCell>{task.assignedTo || 'Unassigned'}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status.replace('_', ' ').toUpperCase()} 
                      color={getStatusColor(task.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
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
          <Table sx={{ minWidth: 650 }} aria-label="pending tasks table">
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.filter(task => task.status === 'pending').map((task) => (
                <TableRow key={task.id}>
                  <TableCell component="th" scope="row">
                    {task.title}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority.toUpperCase()} 
                      color={getPriorityColor(task.priority)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{task.location}</TableCell>
                  <TableCell>{task.assignedTo || 'Unassigned'}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="contained">
                      Assign
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
          <Table sx={{ minWidth: 650 }} aria-label="in progress tasks table">
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.filter(task => task.status === 'in_progress' || task.status === 'assigned').map((task) => (
                <TableRow key={task.id}>
                  <TableCell component="th" scope="row">
                    {task.title}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority.toUpperCase()} 
                      color={getPriorityColor(task.priority)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{task.location}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined">
                      View Details
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
          <Table sx={{ minWidth: 650 }} aria-label="completed tasks table">
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Completion Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.filter(task => task.status === 'completed').map((task) => (
                <TableRow key={task.id}>
                  <TableCell component="th" scope="row">
                    {task.title}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority.toUpperCase()} 
                      color={getPriorityColor(task.priority)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{task.location}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined">
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Create Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Task Title"
                fullWidth
                value={taskFormData.title}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={taskFormData.description}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={taskFormData.priority}
                  label="Priority"
                  onChange={handleFormChange}
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="location"
                label="Location"
                fullWidth
                value={taskFormData.location}
                onChange={handle
(Content truncated due to size limit. Use line ranges to read in chunks)