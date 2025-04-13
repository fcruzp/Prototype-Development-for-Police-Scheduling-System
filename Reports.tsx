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
  Tabs,
  Tab,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAuth } from '../../contexts/AuthContext';

// Chart placeholder component
const ChartPlaceholder = ({ title, height = 300 }) => (
  <Box 
    sx={{ 
      height, 
      bgcolor: '#f5f5f5', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      borderRadius: 1,
      border: '1px dashed #ccc'
    }}
  >
    <Typography variant="body1" color="text.secondary">
      {title}
    </Typography>
  </Box>
);

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

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: '2025-04-01',
    endDate: '2025-04-30'
  });
  const [department, setDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // In a real implementation, these would be actual API calls
        // For the prototype, we'll simulate the data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPerformanceData([
          { id: '1', name: 'John Smith', badgeNumber: 'JCF1001', department: 'Kingston Central', shiftsCompleted: 22, shiftsAssigned: 22, tasksCompleted: 45, tasksAssigned: 48, punctualityRate: 95 },
          { id: '2', name: 'Sarah Williams', badgeNumber: 'JCF1004', department: 'Kingston Central', shiftsCompleted: 20, shiftsAssigned: 22, tasksCompleted: 38, tasksAssigned: 40, punctualityRate: 98 },
          { id: '3', name: 'Michael Brown', badgeNumber: 'JCF1008', department: 'St. Andrew North', shiftsCompleted: 21, shiftsAssigned: 22, tasksCompleted: 32, tasksAssigned: 35, punctualityRate: 90 },
          { id: '4', name: 'Lisa Johnson', badgeNumber: 'JCF1015', department: 'St. Andrew North', shiftsCompleted: 22, shiftsAssigned: 22, tasksCompleted: 42, tasksAssigned: 42, punctualityRate: 100 },
          { id: '5', name: 'Robert Davis', badgeNumber: 'JCF1023', department: 'St. Catherine North', shiftsCompleted: 19, shiftsAssigned: 22, tasksCompleted: 30, tasksAssigned: 38, punctualityRate: 85 }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dateRange, department]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const handleDepartmentChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setDepartment(e.target.value as string);
  };

  const handleGenerateReport = () => {
    // In a real implementation, this would generate a report based on the selected filters
    console.log('Generating report with filters:', { dateRange, department });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Reports & Analytics
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Report Filters
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                value={department}
                label="Department"
                onChange={handleDepartmentChange}
              >
                <MenuItem value="all">All Departments</MenuItem>
                <MenuItem value="kingston_central">Kingston Central</MenuItem>
                <MenuItem value="st_andrew_north">St. Andrew North</MenuItem>
                <MenuItem value="st_catherine_north">St. Catherine North</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={handleGenerateReport}
            >
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
          <Tab label="Performance" />
          <Tab label="Attendance" />
          <Tab label="Task Completion" />
          <Tab label="Department Summary" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Officer Performance Overview
              </Typography>
              <ChartPlaceholder title="Performance Comparison Chart" />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Task Completion Rate
              </Typography>
              <ChartPlaceholder title="Task Completion Pie Chart" />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Officer Performance Details
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="performance table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Officer</TableCell>
                      <TableCell>Badge Number</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Shifts Completed</TableCell>
                      <TableCell>Tasks Completed</TableCell>
                      <TableCell>Punctuality Rate</TableCell>
                      <TableCell>Overall Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {performanceData.map((officer) => (
                      <TableRow key={officer.id}>
                        <TableCell>{officer.name}</TableCell>
                        <TableCell>{officer.badgeNumber}</TableCell>
                        <TableCell>{officer.department}</TableCell>
                        <TableCell>{officer.shiftsCompleted}/{officer.shiftsAssigned}</TableCell>
                        <TableCell>{officer.tasksCompleted}/{officer.tasksAssigned}</TableCell>
                        <TableCell>{officer.punctualityRate}%</TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              officer.punctualityRate >= 95 ? 'Excellent' :
                              officer.punctualityRate >= 85 ? 'Good' :
                              officer.punctualityRate >= 75 ? 'Average' : 'Needs Improvement'
                            } 
                            color={
                              officer.punctualityRate >= 95 ? 'success' :
                              officer.punctualityRate >= 85 ? 'primary' :
                              officer.punctualityRate >= 75 ? 'warning' : 'error'
                            } 
                            size="small" 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Attendance Trends
              </Typography>
              <ChartPlaceholder title="Attendance Trend Line Chart" />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                On-Time vs Late Check-ins
              </Typography>
              <ChartPlaceholder title="Check-in Status Bar Chart" />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Attendance Summary
              </Typography>
              <Typography variant="body1" paragraph>
                During the selected period, the department maintained an overall attendance rate of 94%. 
                On-time check-ins were recorded at 89%, with an average shift completion rate of 96%.
              </Typography>
              <Typography variant="body1">
                Key observations:
              </Typography>
              <ul>
                <li>Morning shifts had the highest punctuality rate at 92%</li>
                <li>Weekend shifts had a slightly lower attendance rate at 88%</li>
                <li>Officers with more than 5 years of service showed 97% attendance reliability</li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Task Completion by Priority
              </Typography>
              <ChartPlaceholder title="Task Priority Completion Chart" />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Task Completion Time Analysis
              </Typography>
              <ChartPlaceholder title="Task Duration Analysis Chart" />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Task Efficiency Metrics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Average Completion Time
                      </Typography>
                      <Typography variant="h4">
                        45 min
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Per task
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        High Priority Completion Rate
                      </Typography>
                      <Typography variant="h4">
                        98%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Within deadline
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Task Reassignment Rate
                      </Typography>
                      <Typography variant="h4">
                        5%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Of all assigned tasks
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Department Performance Comparison
              </Typography>
              <ChartPlaceholder title="Department Performance Radar Chart" height={400} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resource Utilization
              </Typography>
              <ChartPlaceholder title="Resource Utilization Chart" />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Shift Coverage Analysis
              </Typography>
              <ChartPlaceholder title="Shift Coverage Heat Map" />
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Reports;
