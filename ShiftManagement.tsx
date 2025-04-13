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
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
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

const ShiftManagement: React.FC = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<any[]>([]);
  const [shiftAssignments, setShiftAssignments] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [shiftFormData, setShiftFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    minStaffCount: 1,
    recommendedStaffCount: 2,
    isRecurring: false,
    recurringDays: [],
    notes: ''
  });

  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        // In a real implementation, these would be actual API calls
        // For the prototype, we'll simulate the data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setShifts([
          { id: '1', name: 'Morning Patrol', startTime: '08:00', endTime: '16:00', minStaffCount: 10, recommendedStaffCount: 15, isRecurring: true, recurringDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], isActive: true },
          { id: '2', name: 'Evening Patrol', startTime: '16:00', endTime: '00:00', minStaffCount: 8, recommendedStaffCount: 12, isRecurring: true, recurringDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], isActive: true },
          { id: '3', name: 'Night Patrol', startTime: '00:00', endTime: '08:00', minStaffCount: 6, recommendedStaffCount: 10, isRecurring: true, recurringDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], isActive: true },
          { id: '4', name: 'Weekend Day Patrol', startTime: '08:00', endTime: '20:00', minStaffCount: 12, recommendedStaffCount: 18, isRecurring: true, recurringDays: ['Saturday', 'Sunday'], isActive: true },
          { id: '5', name: 'Special Event', startTime: '10:00', endTime: '18:00', minStaffCount: 5, recommendedStaffCount: 8, isRecurring: false, recurringDays: [], isActive: false }
        ]);
        
        setShiftAssignments([
          { id: '1', shiftId: '1', shiftName: 'Morning Patrol', date: '2025-04-12', officers: ['John Smith', 'Sarah Williams', 'Michael Brown', 'Lisa Johnson', 'Robert Davis', 'Emily Wilson', 'David Thompson', 'Jennifer Lee'], status: 'scheduled' },
          { id: '2', shiftId: '2', shiftName: 'Evening Patrol', date: '2025-04-12', officers: ['Thomas Anderson', 'Jessica Martinez', 'Christopher Clark', 'Amanda Lewis', 'Daniel White', 'Michelle Scott', 'Kevin Harris'], status: 'scheduled' },
          { id: '3', shiftId: '3', shiftName: 'Night Patrol', date: '2025-04-12', officers: ['James Wilson', 'Patricia Moore', 'Richard Taylor', 'Barbara Jackson', 'Joseph Martin'], status: 'scheduled' },
          { id: '4', shiftId: '1', shiftName: 'Morning Patrol', date: '2025-04-11', officers: ['John Smith', 'Sarah Williams', 'Michael Brown', 'Lisa Johnson', 'Robert Davis', 'Emily Wilson', 'David Thompson', 'Jennifer Lee'], status: 'completed' },
          { id: '5', shiftId: '2', shiftName: 'Evening Patrol', date: '2025-04-11', officers: ['Thomas Anderson', 'Jessica Martinez', 'Christopher Clark', 'Amanda Lewis', 'Daniel White', 'Michelle Scott', 'Kevin Harris'], status: 'in_progress' }
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
        console.error('Error fetching shift data:', error);
        setLoading(false);
      }
    };

    fetchShiftData();
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
    setShiftFormData({
      ...shiftFormData,
      [name as string]: value
    });
  };

  const handleSubmit = () => {
    // In a real implementation, this would send data to the API
    console.log('Submitting shift:', shiftFormData);
    handleCloseDialog();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Shift Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Create Shift
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="shift management tabs">
          <Tab label="Shift Templates" />
          <Tab label="Shift Assignments" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="shift templates table">
            <TableHead>
              <TableRow>
                <TableCell>Shift Name</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Staff Count</TableCell>
                <TableCell>Recurring</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell component="th" scope="row">
                    {shift.name}
                  </TableCell>
                  <TableCell>{shift.startTime} - {shift.endTime}</TableCell>
                  <TableCell>{shift.minStaffCount} - {shift.recommendedStaffCount}</TableCell>
                  <TableCell>
                    {shift.isRecurring ? (
                      <Chip 
                        label={shift.recurringDays.join(', ')} 
                        color="primary" 
                        size="small" 
                      />
                    ) : (
                      <Chip label="One-time" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={shift.isActive ? 'Active' : 'Inactive'} 
                      color={shift.isActive ? 'success' : 'default'} 
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            size="small"
          >
            Filter
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            size="small"
          >
            Assign Shift
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="shift assignments table">
            <TableHead>
              <TableRow>
                <TableCell>Shift</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Officers Assigned</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shiftAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell component="th" scope="row">
                    {assignment.shiftName}
                  </TableCell>
                  <TableCell>{assignment.date}</TableCell>
                  <TableCell>
                    {assignment.officers.length} officers
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={assignment.status.replace('_', ' ').toUpperCase()} 
                      color={
                        assignment.status === 'completed' ? 'success' : 
                        assignment.status === 'in_progress' ? 'primary' : 
                        'default'
                      } 
                      size="small" 
                    />
                  </TableCell>
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

      {/* Create Shift Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Shift</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Shift Name"
                fullWidth
                value={shiftFormData.name}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="startTime"
                label="Start Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={shiftFormData.startTime}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="endTime"
                label="End Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={shiftFormData.endTime}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="minStaffCount"
                label="Minimum Staff Count"
                type="number"
                fullWidth
                value={shiftFormData.minStaffCount}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="recommendedStaffCount"
                label="Recommended Staff Count"
                type="number"
                fullWidth
                value={shiftFormData.recommendedStaffCount}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="recurring-label">Recurring</InputLabel>
                <Select
                  labelId="recurring-label"
                  name="isRecurring"
                  value={shiftFormData.isRecurring}
                  label="Recurring"
                  onChange={handleFormChange}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {shiftFormData.isRecurring && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="days-label">Recurring Days</InputLabel>
                  <Select
                    labelId="days-label"
                    name="recurringDays"
                    multiple
                    value={shiftFormData.recurringDays}
                    label="Recurring Days"
                    onChange={handleFormChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                multiline
                rows={4}
                fullWidth
                value={shiftFormData.notes}
                onChange={handleFormChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShiftManagement;
