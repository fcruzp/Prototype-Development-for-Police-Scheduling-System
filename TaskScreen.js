import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert
} from 'react-native';
import { Card, Title, Paragraph, Chip, Button, Divider, List, Badge, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';

const TaskScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState([
    { 
      id: '1', 
      title: 'Traffic Control', 
      description: 'Manage traffic flow at Half Way Tree intersection during morning rush hour',
      priority: 'high', 
      status: 'in_progress', 
      location: 'Half Way Tree', 
      dueDate: '2025-04-11',
      dueTime: '10:00 AM',
      assignedBy: 'Sgt. Williams',
      notes: []
    },
    { 
      id: '2', 
      title: 'Community Outreach', 
      description: 'Conduct community outreach program in Trench Town area, focusing on youth engagement',
      priority: 'medium', 
      status: 'pending', 
      location: 'Trench Town', 
      dueDate: '2025-04-12',
      dueTime: '02:00 PM',
      assignedBy: 'Capt. Johnson',
      notes: []
    },
    { 
      id: '3', 
      title: 'Patrol Downtown', 
      description: 'Regular patrol of downtown Kingston area with focus on business district',
      priority: 'medium', 
      status: 'assigned', 
      location: 'Downtown Kingston', 
      dueDate: '2025-04-11',
      dueTime: '01:00 PM',
      assignedBy: 'Lt. Brown',
      notes: []
    },
    { 
      id: '4', 
      title: 'Incident Report #JCF-2025-0423', 
      description: 'Follow up on incident report from New Kingston regarding property damage',
      priority: 'low', 
      status: 'completed', 
      location: 'New Kingston', 
      dueDate: '2025-04-10',
      dueTime: '04:00 PM',
      assignedBy: 'Sgt. Davis',
      notes: [
        { id: '1', text: 'Interviewed witnesses at the scene', timestamp: '2025-04-10 14:30' },
        { id: '2', text: 'Collected evidence and took photographs', timestamp: '2025-04-10 15:15' },
        { id: '3', text: 'Filed initial report', timestamp: '2025-04-10 16:45' }
      ]
    }
  ]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    // In a real app, this would send the note to the server
    const updatedTask = { 
      ...selectedTask,
      notes: [
        ...selectedTask.notes,
        { 
          id: Date.now().toString(), 
          text: newNote, 
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]
    };
    
    setSelectedTask(updatedTask);
    setNewNote('');
    
    // Update the task in the list
    const updatedTasks = tasks.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  const handleUpdateStatus = (newStatus) => {
    Alert.alert(
      "Update Task Status",
      `Are you sure you want to mark this task as ${newStatus.replace('_', ' ')}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            // In a real app, this would trigger biometric authentication
            // and then send the status update to the server
            
            // Update the task status
            const updatedTask = { ...selectedTask, status: newStatus };
            setSelectedTask(updatedTask);
            
            // Update the task in the list
            const updatedTasks = tasks.map(task => 
              task.id === selectedTask.id ? updatedTask : task
            );
            setTasks(updatedTasks);
            
            Alert.alert("Success", "Task status updated successfully");
          }
        }
      ]
    );
  };

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
      case 'assigned': return '#9c27b0';
      case 'pending': return '#ff9800';
      default: return '#757575';
    }
  };

  const getStatusLabel = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const filteredTasks = () => {
    if (activeTab === 'all') return tasks;
    if (activeTab === 'active') return tasks.filter(task => task.status !== 'completed');
    if (activeTab === 'completed') return tasks.filter(task => task.status === 'completed');
    return tasks;
  };

  const renderTaskDetails = () => {
    if (!selectedTask) return null;

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailsHeader}>
          <Title>{selectedTask.title}</Title>
          <TouchableOpacity onPress={handleCloseDetails}>
            <Icon name="close" size={24} color="#757575" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.badgeContainer}>
          <Badge 
            style={[styles.priorityBadge, { backgroundColor: getPriorityColor(selectedTask.priority) }]}
          >
            {selectedTask.priority.toUpperCase()}
          </Badge>
          <Badge 
            style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedTask.status) }]}
          >
            {getStatusLabel(selectedTask.status)}
          </Badge>
        </View>
        
        <Divider style={styles.divider} />
        
        <Paragraph style={styles.description}>
          {selectedTask.description}
        </Paragraph>
        
        <View style={styles.detailRow}>
          <Icon name="map-marker" size={20} color="#1976d2" />
          <Text style={styles.detailText}>{selectedTask.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="calendar" size={20} color="#1976d2" />
          <Text style={styles.detailText}>Due: {selectedTask.dueDate} at {selectedTask.dueTime}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="account" size={20} color="#1976d2" />
          <Text style={styles.detailText}>Assigned by: {selectedTask.assignedBy}</Text>
        </View>
        
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 18.0179,
            longitude: -76.8099,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: 18.0179, longitude: -76.8099 }}
            title={selectedTask.location}
            description={selectedTask.title}
          />
        </MapView>
        
        <Title style={styles.notesTitle}>Notes & Updates</Title>
        
        {selectedTask.notes.length > 0 ? (
          <View style={styles.notesList}>
            {selectedTask.notes.map(note => (
              <View key={note.id} style={styles.noteItem}>
                <Text style={styles.noteText}>{note.text}</Text>
                <Text style={styles.noteTimestamp}>{note.timestamp}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Paragraph style={styles.emptyNotes}>No notes added yet.</Paragraph>
        )}
        
        {selectedTask.status !== 'completed' && (
          <View style={styles.addNoteContainer}>
            <TextInput
              label="Add a note"
              value={newNote}
              onChangeText={setNewNote}
              mode="outlined"
              style={styles.noteInput}
              multiline
            />
            <Button 
              mode="contained" 
              onPress={handleAddNote}
              disabled={!newNote.trim()}
              style={styles.addNoteButton}
            >
              Add
            </Button>
          </View>
        )}
        
        {selectedTask.status !== 'completed' && (
          <View style={styles.actionButtons}>
            {selectedTask.status === 'pending' && (
              <Button 
                mode="contained" 
                onPress={() => handleUpdateStatus('in_progress')}
                style={[styles.actionButton, { backgroundColor: '#2196f3' }]}
                icon="play"
              >
                Start Task
              </Button>
            )}
            
            {selectedTask.status === 'in_progress' && (
              <Button 
                mode="contained" 
                onPress={() => handleUpdateStatus('completed')}
                style={[styles.actionButton, { backgroundColor: '#4caf50' }]}
                icon="check"
              >
                Complete Task
              </Button>
            )}
            
            {selectedTask.status === 'assigned' && (
              <Button 
                mode="contained" 
                onPress={() => handleUpdateStatus('in_progress')}
                style={[styles.actionButton, { backgroundColor: '#2196f3' }]}
                icon="play"
              >
                Start Task
              </Button>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {showDetails ? (
        renderTaskDetails()
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Tasks</Text>
          </View>
          
          <View style={styles.filterContainer}>
            <Chip 
              selected={activeTab === 'all'} 
              onPress={() => setActiveTab('all')} 
              style={styles.filterChip}
            >
              All
            </Chip>
            <Chip 
              selected={activeTab === 'active'} 
              onPress={() => setActiveTab('active')} 
              style={styles.filterChip}
            >
              Active
            </Chip>
            <Chip 
              selected={activeTab === 'completed'} 
              onPress={() => setActiveTab('completed')} 
              style={styles.filterChip}
            >
              Completed
            </Chip>
          </View>
          
          {filteredTasks().map(task => (
            <Card 
              key={task.id} 
              style={[
                styles.taskCard, 
                task.status === 'completed' && styles.completedTaskCard
              ]}
              onPress={() => handleTaskPress(task)}
            >
              <Card.Content>
                <View style={styles.taskHeader}>
                  <Title style={styles.taskTitle}>{task.title}</Title>
                  <View style={styles.badgeContainer}>
                    <Badge 
                      style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}
                    >
                      {task.priority.toUpperCase()}
                    </Badge>
                    <Badge 
                      style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}
                    >
                      {getStatusLabel(task.status)}
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
                    <Text style={styles.taskDetailText}>Due: {task.dueTime} on {task.dueDate}</Text>
                  </View>
                </View>
                
                {task.notes.length > 0 && (
                  <View style={styles.notesIndicator}>
                    <Icon name="note-text" size={16} color="#757575" />
                    <Text style={styles.notesCount}>{task.notes.length} notes</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  taskCard: {
    marginBottom: 12,
    elevation: 1,
  },
  completedTaskCard: {
    opacity: 0.7,
  },
  taskHeader: {
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  priorityBadge: {
    marginRight: 8,
  },
  statusBadge: {
  },
  taskDetails: {
    marginTop: 8,
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
  notesIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  notesCount: {
    marginLeft: 8,
    fontSize: 12,
    color: '#757575',
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 12,
  },
  description: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
  },
  map: {
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  notesTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
  },
  notesList: {
    marginBottom: 16,
  },
  noteItem: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    textAlign: 'right',
  },
  emptyNotes: {
    fontStyle: 'italic',
    color: '#757575',
    marginBottom: 16,
  },
  addNoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  noteInput: {
    flex: 1,
    marginRight: 8,
  },
  addNoteButton: {
    marginBottom: 6,
  },
  actionButtons: {
    marginTop: 8,
  },
  actionButton: {
    marginVertical: 4,
  },
});

export default TaskScreen;
