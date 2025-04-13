import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ScrollView,
  RefreshControl
} from 'react-native';
import { Card, Title, Paragraph, Chip, Button, Divider, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OfficerDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [officerData, setOfficerData] = useState({
    name: 'John Smith',
    badgeNumber: 'JCF1001',
    department: 'Kingston Central',
    status: 'on_duty',
    currentShift: {
      name: 'Morning Patrol',
      startTime: '08:00',
      endTime: '16:00',
      location: 'Kingston Central',
      supervisor: 'Capt. Johnson'
    },
    upcomingShifts: 5,
    activeTasks: 3,
    completedTasks: 28,
    tasks: [
      { id: '1', title: 'Traffic Control', priority: 'high', status: 'in_progress', location: 'Half Way Tree', dueTime: '10:00 AM' },
      { id: '2', title: 'Community Outreach', priority: 'medium', status: 'pending', location: 'Trench Town', dueTime: '02:00 PM' },
      { id: '3', title: 'Incident Report #JCF-2025-0423', priority: 'low', status: 'completed', location: 'New Kingston', dueTime: 'Yesterday' }
    ]
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#2196f3';
      default: return '#757575';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#4caf50';
      case 'in_progress': return '#2196f3';
      case 'pending': return '#ff9800';
      default: return '#757575';
    }
  };

  const handleCheckIn = () => {
    // In a real app, this would trigger biometric authentication
    // and then send the check-in request to the server
    alert('Checking in to shift...');
  };

  const handleCheckOut = () => {
    // In a real app, this would trigger biometric authentication
    // and then send the check-out request to the server
    alert('Checking out of shift...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Officer Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.nameText}>{officerData.name}</Text>
              <Text style={styles.badgeText}>Badge: {officerData.badgeNumber}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: officerData.status === 'on_duty' ? '#4caf50' : '#ff9800' }]}>
              <Text style={styles.statusText}>{officerData.status === 'on_duty' ? 'On Duty' : 'Off Duty'}</Text>
            </View>
          </View>
        </View>

        {/* Current Shift Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Current Shift</Title>
            {officerData.currentShift ? (
              <>
                <View style={styles.shiftHeader}>
                  <Text style={styles.shiftName}>{officerData.currentShift.name}</Text>
                  <Chip mode="outlined" style={styles.todayChip}>Today</Chip>
                </View>
                <View style={styles.shiftDetails}>
                  <View style={styles.shiftDetail}>
                    <Icon name="clock-outline" size={20} color="#757575" />
                    <Text style={styles.shiftDetailText}>
                      {officerData.currentShift.startTime} - {officerData.currentShift.endTime}
                    </Text>
                  </View>
                  <View style={styles.shiftDetail}>
                    <Icon name="map-marker-outline" size={20} color="#757575" />
                    <Text style={styles.shiftDetailText}>
                      {officerData.currentShift.location}
                    </Text>
                  </View>
                  <View style={styles.shiftDetail}>
                    <Icon name="account-outline" size={20} color="#757575" />
                    <Text style={styles.shiftDetailText}>
                      Supervisor: {officerData.currentShift.supervisor}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <Button 
                    mode="contained" 
                    onPress={handleCheckIn}
                    style={[styles.actionButton, styles.checkInButton]}
                    icon="login"
                  >
                    Check In
                  </Button>
                  <Button 
                    mode="outlined" 
                    onPress={handleCheckOut}
                    style={styles.actionButton}
                    icon="logout"
                  >
                    Check Out
                  </Button>
                </View>
              </>
            ) : (
              <Paragraph>No active shift at the moment.</Paragraph>
            )}
          </Card.Content>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <View style={styles.statIconContainer}>
                <Icon name="calendar" size={24} color="#1976d2" />
              </View>
              <View>
                <Text style={styles.statValue}>{officerData.upcomingShifts}</Text>
                <Text style={styles.statLabel}>Upcoming Shifts</Text>
              </View>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <View style={styles.statIconContainer}>
                <Icon name="clipboard-list" size={24} color="#ff9800" />
              </View>
              <View>
                <Text style={styles.statValue}>{officerData.activeTasks}</Text>
                <Text style={styles.statLabel}>Active Tasks</Text>
              </View>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <View style={styles.statIconContainer}>
                <Icon name="check-circle" size={24} color="#4caf50" />
              </View>
              <View>
                <Text style={styles.statValue}>{officerData.completedTasks}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Tasks Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {officerData.tasks.map((task) => (
          <Card key={task.id} style={styles.taskCard}>
            <Card.Content>
              <View style={styles.taskHeader}>
                <Title style={styles.taskTitle}>{task.title}</Title>
                <View style={styles.taskBadges}>
                  <Badge 
                    style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}
                  >
                    {task.priority.toUpperCase()}
                  </Badge>
                  <Badge 
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}
                  >
                    {task.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </View>
              </View>
              
              <View style={styles.taskDetails}>
                <View style={styles.taskDetail}>
                  <Icon name="map-marker" size={16} color="#757575" />
                  <Text style={styles.taskDetailText}>{task.location}</Text>
                </View>
                <View style={styles.taskDetail}>
                  <Icon name="clock" size={16} color="#757575" />
                  <Text style={styles.taskDetailText}>Due: {task.dueTime}</Text>
                </View>
              </View>
              
              <View style={styles.taskActions}>
                <Button 
                  mode="text" 
                  compact 
                  onPress={() => {}}
                >
                  Details
                </Button>
                {task.status !== 'completed' && (
                  <Button 
                    mode="contained" 
                    compact 
                    onPress={() => {}}
                    style={styles.updateButton}
                  >
                    Update Status
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    backgroundColor: '#1976d2',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  badgeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  shiftName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  todayChip: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  },
  shiftDetails: {
    marginBottom: 16,
  },
  shiftDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftDetailText: {
    marginLeft: 8,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  checkInButton: {
    backgroundColor: '#4caf50',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    marginRight: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#1976d2',
  },
  taskCard: {
    marginBottom: 12,
    elevation: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
  },
  taskBadges: {
    flexDirection: 'row',
  },
  priorityBadge: {
    marginRight: 4,
  },
  statusBadge: {
    marginLeft: 4,
  },
  taskDetails: {
    marginVertical: 8,
  },
  taskDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#757575',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  updateButton: {
    marginLeft: 8,
  },
});

export default OfficerDashboard;
