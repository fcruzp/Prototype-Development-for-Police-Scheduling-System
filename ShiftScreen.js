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
import { Card, Title, Paragraph, Chip, Button, Divider, List, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';

const ShiftScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [shifts, setShifts] = useState([
    { 
      id: '1', 
      name: 'Morning Patrol', 
      date: '2025-04-12', 
      startTime: '08:00', 
      endTime: '16:00', 
      location: 'Kingston Central',
      supervisor: 'Capt. Johnson',
      status: 'upcoming',
      officers: 12,
      notes: 'Focus on community engagement in downtown area.'
    },
    { 
      id: '2', 
      name: 'Evening Patrol', 
      date: '2025-04-12', 
      startTime: '16:00', 
      endTime: '00:00', 
      location: 'Half Way Tree',
      supervisor: 'Sgt. Williams',
      status: 'upcoming',
      officers: 10,
      notes: 'Monitor traffic and business district security.'
    },
    { 
      id: '3', 
      name: 'Morning Patrol', 
      date: '2025-04-11', 
      startTime: '08:00', 
      endTime: '16:00', 
      location: 'Kingston Central',
      supervisor: 'Capt. Johnson',
      status: 'completed',
      officers: 12,
      notes: 'Regular patrol duties.'
    },
    { 
      id: '4', 
      name: 'Special Event', 
      date: '2025-04-13', 
      startTime: '10:00', 
      endTime: '18:00', 
      location: 'National Stadium',
      supervisor: 'Lt. Brown',
      status: 'upcoming',
      officers: 20,
      notes: 'Security detail for national football match.'
    },
    { 
      id: '5', 
      name: 'Night Patrol', 
      date: '2025-04-13', 
      startTime: '00:00', 
      endTime: '08:00', 
      location: 'New Kingston',
      supervisor: 'Sgt. Davis',
      status: 'upcoming',
      officers: 8,
      notes: 'Focus on entertainment district security.'
    }
  ]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleShiftPress = (shift) => {
    setSelectedShift(shift);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleRequestSwap = (shiftId) => {
    Alert.alert(
      "Request Shift Swap",
      "Are you sure you want to request a swap for this shift?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            // In a real app, this would send the request to the server
            Alert.alert("Success", "Shift swap request submitted");
          }
        }
      ]
    );
  };

  const handleRequestLeave = (shiftId) => {
    Alert.alert(
      "Request Leave",
      "Are you sure you want to request leave for this shift?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            // In a real app, this would send the request to the server
            Alert.alert("Success", "Leave request submitted");
          }
        }
      ]
    );
  };

  const renderShiftDetails = () => {
    if (!selectedShift) return null;

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailsHeader}>
          <Title>{selectedShift.name}</Title>
          <TouchableOpacity onPress={handleCloseDetails}>
            <Icon name="close" size={24} color="#757575" />
          </TouchableOpacity>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Icon name="calendar" size={20} color="#1976d2" />
          <Text style={styles.detailText}>{selectedShift.date}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="clock-outline" size={20} color="#1976d2" />
          <Text style={styles.detailText}>{selectedShift.startTime} - {selectedShift.endTime}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="map-marker-outline" size={20} color="#1976d2" />
          <Text style={styles.detailText}>{selectedShift.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="account-outline" size={20} color="#1976d2" />
          <Text style={styles.detailText}>Supervisor: {selectedShift.supervisor}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="account-group-outline" size={20} color="#1976d2" />
          <Text style={styles.detailText}>{selectedShift.officers} officers assigned</Text>
        </View>
        
        <Paragraph style={styles.notes}>
          <Text style={styles.notesLabel}>Notes: </Text>
          {selectedShift.notes}
        </Paragraph>
        
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
            title={selectedShift.location}
            description={`${selectedShift.startTime} - ${selectedShift.endTime}`}
          />
        </MapView>
        
        {selectedShift.status === 'upcoming' && (
          <View style={styles.actionButtons}>
            <Button 
              mode="outlined" 
              onPress={() => handleRequestSwap(selectedShift.id)}
              style={styles.actionButton}
              icon="swap-horizontal"
            >
              Request Swap
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => handleRequestLeave(selectedShift.id)}
              style={styles.actionButton}
              icon="calendar-remove"
            >
              Request Leave
            </Button>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {showDetails ? (
        renderShiftDetails()
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Shifts</Text>
          </View>
          
          <View style={styles.filterContainer}>
            <Chip 
              selected 
              onPress={() => {}} 
              style={styles.filterChip}
            >
              All
            </Chip>
            <Chip 
              onPress={() => {}} 
              style={styles.filterChip}
            >
              Upcoming
            </Chip>
            <Chip 
              onPress={() => {}} 
              style={styles.filterChip}
            >
              Completed
            </Chip>
          </View>
          
          <List.Section>
            <List.Subheader>Upcoming Shifts</List.Subheader>
            {shifts
              .filter(shift => shift.status === 'upcoming')
              .map(shift => (
                <Card 
                  key={shift.id} 
                  style={styles.shiftCard}
                  onPress={() => handleShiftPress(shift)}
                >
                  <Card.Content>
                    <View style={styles.shiftHeader}>
                      <Title style={styles.shiftTitle}>{shift.name}</Title>
                      <Chip mode="outlined">{shift.date}</Chip>
                    </View>
                    
                    <View style={styles.shiftDetails}>
                      <View style={styles.shiftDetail}>
                        <Icon name="clock-outline" size={16} color="#757575" />
                        <Text style={styles.shiftDetailText}>
                          {shift.startTime} - {shift.endTime}
                        </Text>
                      </View>
                      <View style={styles.shiftDetail}>
                        <Icon name="map-marker-outline" size={16} color="#757575" />
                        <Text style={styles.shiftDetailText}>
                          {shift.location}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            
            <List.Subheader>Past Shifts</List.Subheader>
            {shifts
              .filter(shift => shift.status === 'completed')
              .map(shift => (
                <Card 
                  key={shift.id} 
                  style={[styles.shiftCard, styles.completedShiftCard]}
                  onPress={() => handleShiftPress(shift)}
                >
                  <Card.Content>
                    <View style={styles.shiftHeader}>
                      <Title style={styles.shiftTitle}>{shift.name}</Title>
                      <Chip mode="outlined">{shift.date}</Chip>
                    </View>
                    
                    <View style={styles.shiftDetails}>
                      <View style={styles.shiftDetail}>
                        <Icon name="clock-outline" size={16} color="#757575" />
                        <Text style={styles.shiftDetailText}>
                          {shift.startTime} - {shift.endTime}
                        </Text>
                      </View>
                      <View style={styles.shiftDetail}>
                        <Icon name="map-marker-outline" size={16} color="#757575" />
                        <Text style={styles.shiftDetailText}>
                          {shift.location}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
          </List.Section>
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
  shiftCard: {
    marginBottom: 12,
    elevation: 1,
  },
  completedShiftCard: {
    opacity: 0.7,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftTitle: {
    fontSize: 16,
  },
  shiftDetails: {
    marginTop: 4,
  },
  shiftDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shiftDetailText: {
    marginLeft: 8,
    fontSize: 14,
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
  },
  notes: {
    marginVertical: 12,
  },
  notesLabel: {
    fontWeight: 'bold',
  },
  map: {
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default ShiftScreen;
