import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Card, 
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../../contexts/AuthContext';

// This would be replaced with an actual map component like Mapbox or Google Maps
const MapPlaceholder = () => (
  <Box 
    sx={{ 
      height: 500, 
      bgcolor: '#e0e0e0', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      borderRadius: 1,
      position: 'relative'
    }}
  >
    <Typography variant="h6" color="text.secondary">
      Interactive Map Would Be Displayed Here
    </Typography>
    <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
      <IconButton>
        <RefreshIcon />
      </IconButton>
    </Box>
    
    {/* Simulated officer markers */}
    <Box sx={{ position: 'absolute', top: '30%', left: '40%' }}>
      <Avatar sx={{ bgcolor: 'success.main', border: '2px solid white' }}>JS</Avatar>
    </Box>
    <Box sx={{ position: 'absolute', top: '45%', left: '60%' }}>
      <Avatar sx={{ bgcolor: 'success.main', border: '2px solid white' }}>SW</Avatar>
    </Box>
    <Box sx={{ position: 'absolute', top: '60%', left: '30%' }}>
      <Avatar sx={{ bgcolor: 'warning.main', border: '2px solid white' }}>MB</Avatar>
    </Box>
    <Box sx={{ position: 'absolute', top: '25%', left: '70%' }}>
      <Avatar sx={{ bgcolor: 'success.main', border: '2px solid white' }}>LJ</Avatar>
    </Box>
    <Box sx={{ position: 'absolute', top: '70%', left: '50%' }}>
      <Avatar sx={{ bgcolor: 'success.main', border: '2px solid white' }}>RD</Avatar>
    </Box>
  </Box>
);

const OfficerTracking: React.FC = () => {
  const { user } = useAuth();
  const [activeOfficers, setActiveOfficers] = useState<any[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        // In a real implementation, these would be actual API calls
        // For the prototype, we'll simulate the data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setActiveOfficers([
          { id: '1', firstName: 'John', lastName: 'Smith', badgeNumber: 'JCF1001', status: 'on_duty', lastLocation: 'Kingston Central', coordinates: [18.0179, -76.8099], lastUpdated: '10 minutes ago', currentTask: 'Traffic Control' },
          { id: '2', firstName: 'Sarah', lastName: 'Williams', badgeNumber: 'JCF1004', status: 'on_duty', lastLocation: 'Half Way Tree', coordinates: [18.0105, -76.7991], lastUpdated: '5 minutes ago', currentTask: 'Patrol' },
          { id: '3', firstName: 'Michael', lastName: 'Brown', badgeNumber: 'JCF1008', status: 'on_break', lastLocation: 'New Kingston', coordinates: [18.0080, -76.7829], lastUpdated: '2 minutes ago', currentTask: 'Break' },
          { id: '4', firstName: 'Lisa', lastName: 'Johnson', badgeNumber: 'JCF1015', status: 'on_duty', lastLocation: 'Cross Roads', coordinates: [18.0146, -76.7864], lastUpdated: '30 minutes ago', currentTask: 'Community Outreach' },
          { id: '5', firstName: 'Robert', lastName: 'Davis', badgeNumber: 'JCF1023', status: 'on_duty', lastLocation: 'Downtown Kingston', coordinates: [17.9771, -76.7674], lastUpdated: '15 minutes ago', currentTask: 'Patrol' }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching officer data:', error);
        setLoading(false);
      }
    };

    fetchOfficerData();
  }, []);

  const handleOpenDialog = (officer: any) => {
    setSelectedOfficer(officer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSendMessage = () => {
    // In a real implementation, this would send a message to the officer
    console.log('Sending message to officer:', selectedOfficer);
    handleCloseDialog();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Officer Tracking
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Real-time location tracking of officers in the field.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Live Map
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                size="small"
              >
                Refresh
              </Button>
            </Box>
            <MapPlaceholder />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Officers
            </Typography>
            <List>
              {activeOfficers.map((officer) => (
                <React.Fragment key={officer.id}>
                  <ListItem 
                    alignItems="flex-start"
                    secondaryAction={
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleOpenDialog(officer)}
                      >
                        Details
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: officer.status === 'on_duty' ? 'success.main' : 'warning.main' }}>
                        {officer.firstName.charAt(0)}{officer.lastName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1">
                            {officer.firstName} {officer.lastName}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={officer.status === 'on_duty' ? 'On Duty' : 'On Break'} 
                            color={officer.status === 'on_duty' ? 'success' : 'warning'}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {officer.badgeNumber}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {officer.lastLocation} • Updated {officer.lastUpdated}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            Current Task: {officer.currentTask}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Officer Details Dialog */}
      {selectedOfficer && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Officer Details
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: selectedOfficer.status === 'on_duty' ? 'success.main' : 'warning.main' }}>
                {selectedOfficer.firstName.charAt(0)}{selectedOfficer.lastName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {selectedOfficer.firstName} {selectedOfficer.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Badge: {selectedOfficer.badgeNumber}
                </Typography>
                <Chip 
                  size="small" 
                  label={selectedOfficer.status === 'on_duty' ? 'On Duty' : 'On Break'} 
                  color={selectedOfficer.status === 'on_duty' ? 'success' : 'warning'}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Location Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {selectedOfficer.lastLocation}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: {selectedOfficer.lastUpdated}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coordinates: {selectedOfficer.coordinates[0]}, {selectedOfficer.coordinates[1]}
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Current Assignment
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedOfficer.currentTask}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Send Message
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Type a message to send to the officer..."
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSendMessage}
              startIcon={<PersonPinCircleIcon />}
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default OfficerTracking;
