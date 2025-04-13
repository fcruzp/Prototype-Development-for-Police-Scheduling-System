import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
  Switch
} from 'react-native';
import { Card, Title, Paragraph, Button, Divider, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, Circle } from 'react-native-maps';

const GeolocationScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 18.0179,
    longitude: -76.8099,
    timestamp: new Date().toISOString()
  });
  const [locationHistory, setLocationHistory] = useState([
    { latitude: 18.0179, longitude: -76.8099, timestamp: '2025-04-11T08:30:00Z' },
    { latitude: 18.0165, longitude: -76.8120, timestamp: '2025-04-11T09:00:00Z' },
    { latitude: 18.0150, longitude: -76.8140, timestamp: '2025-04-11T09:30:00Z' },
    { latitude: 18.0135, longitude: -76.8160, timestamp: '2025-04-11T10:00:00Z' },
    { latitude: 18.0120, longitude: -76.8180, timestamp: '2025-04-11T10:30:00Z' }
  ]);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      // Update current location
      setCurrentLocation({
        latitude: 18.0179 + (Math.random() * 0.002 - 0.001),
        longitude: -76.8099 + (Math.random() * 0.002 - 0.001),
        timestamp: new Date().toISOString()
      });
      setRefreshing(false);
    }, 1000);
  }, []);

  const toggleTracking = () => {
    if (!trackingEnabled) {
      // In a real app, this would trigger biometric authentication
      // before enabling tracking
      Alert.alert(
        "Enable Location Tracking",
        "This will allow the system to track your location while on duty. Biometric authentication required.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Authenticate",
            onPress: () => {
              setTrackingEnabled(true);
              Alert.alert("Success", "Location tracking enabled");
            }
          }
        ]
      );
    } else {
      Alert.alert(
        "Disable Location Tracking",
        "Are you sure you want to disable location tracking? This may affect your duty status.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Disable",
            onPress: () => {
              setTrackingEnabled(false);
              Alert.alert("Notice", "Location tracking disabled");
            }
          }
        ]
      );
    }
  };

  const triggerEmergency = () => {
    Alert.alert(
      "EMERGENCY ALERT",
      "This will send an immediate emergency alert with your location to all nearby officers and command center. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "SEND EMERGENCY ALERT",
          style: "destructive",
          onPress: () => {
            // In a real app, this would send an emergency alert
            setEmergencyMode(true);
            Alert.alert(
              "Emergency Alert Sent",
              "Your emergency alert has been sent. Help is on the way. Stay on this screen for real-time location sharing."
            );
          }
        }
      ]
    );
  };

  const cancelEmergency = () => {
    Alert.alert(
      "Cancel Emergency",
      "Are you sure you want to cancel the emergency alert?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes, Cancel Emergency",
          onPress: () => {
            setEmergencyMode(false);
            Alert.alert("Emergency Cancelled", "Your emergency alert has been cancelled.");
          }
        }
      ]
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Location Tracking</Text>
          <View style={styles.trackingToggle}>
            <Text style={styles.trackingLabel}>
              {trackingEnabled ? 'Tracking Enabled' : 'Tracking Disabled'}
            </Text>
            <Switch
              value={trackingEnabled}
              onValueChange={toggleTracking}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={trackingEnabled ? '#1976d2' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Map View */}
        <Card style={styles.mapCard}>
          <Card.Content>
            <Title>Current Location</Title>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude
                }}
                title="Current Location"
                description={`Updated: ${formatTimestamp(currentLocation.timestamp)}`}
              >
                <View style={styles.markerContainer}>
                  <Avatar.Icon 
                    size={40} 
                    icon="account" 
                    backgroundColor="#1976d2"
                    color="#ffffff"
                  />
                </View>
              </Marker>
              
              {/* Location history markers */}
              {locationHistory.map((location, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                  }}
                  title={`Previous Location`}
                  description={`At: ${formatTimestamp(location.timestamp)}`}
                  opacity={0.7}
                >
                  <View style={styles.historyMarkerContainer}>
                    <Avatar.Icon 
                      size={24} 
                      icon="history" 
                      backgroundColor="#757575"
                      color="#ffffff"
                    />
                  </View>
                </Marker>
              ))}
              
              {/* Emergency radius */}
              {emergencyMode && (
                <Circle
                  center={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude
                  }}
                  radius={300}
                  fillColor="rgba(255, 0, 0, 0.2)"
                  strokeColor="rgba(255, 0, 0, 0.5)"
                />
              )}
            </MapView>
            
            <View style={styles.locationDetails}>
              <Text style={styles.locationText}>
                Lat: {currentLocation.latitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                Long: {currentLocation.longitude.toFixed(6)}
              </Text>
              <Text style={styles.locationTimestamp}>
                Last updated: {formatTimestamp(currentLocation.timestamp)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Emergency Button */}
        {emergencyMode ? (
          <Card style={styles.emergencyActiveCard}>
            <Card.Content>
              <View style={styles.emergencyHeader}>
                <Icon name="alert" size={24} color="#ffffff" />
                <Title style={styles.emergencyTitle}>EMERGENCY MODE ACTIVE</Title>
              </View>
              <Paragraph style={styles.emergencyText}>
                Your location is being shared in real-time with the command center and nearby officers.
                Help is on the way.
              </Paragraph>
              <Button 
                mode="contained" 
                onPress={cancelEmergency}
                style={styles.cancelEmergencyButton}
              >
                Cancel Emergency
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.emergencyCard}>
            <Card.Content>
              <Title>Emergency Assistance</Title>
              <Paragraph>
                Press the emergency button if you need immediate assistance. This will alert the command center and nearby officers.
              </Paragraph>
              <Button 
                mode="contained" 
                onPress={triggerEmergency}
                style={styles.emergencyButton}
                icon="alert"
              >
                Emergency
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Location History */}
        <Card style={styles.historyCard}>
          <Card.Content>
            <Title>Location History</Title>
            <Divider style={styles.divider} />
            
            {locationHistory.map((location, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyDot} />
                <View style={styles.historyContent}>
                  <Text style={styles.historyTime}>
                    {formatTimestamp(location.timestamp)}
                  </Text>
                  <Text style={styles.historyCoordinates}>
                    Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Privacy Notice */}
        <Card style={styles.privacyCard}>
          <Card.Content>
            <Title>Privacy Notice</Title>
            <Paragraph>
              Your location is only tracked while you are on duty. Location data is used for operational purposes only and is protected according to JCF data policies.
            </Paragraph>
          </Card.Content>
        </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trackingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  mapCard: {
    marginBottom: 16,
    elevation: 2,
  },
  map: {
    height: 300,
    marginVertical: 8,
    borderRadius: 8,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDetails: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  locationText: {
    fontSize: 14,
  },
  locationTimestamp: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  emergencyCard: {
    marginBottom: 16,
    elevation: 2,
  },
  emergencyActiveCard: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: '#d32f2f',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    color: '#ffffff',
    marginLeft: 8,
  },
  emergencyText: {
    color: '#ffffff',
    marginBottom: 16,
  },
  emergencyButton: {
    marginTop: 8,
    backgroundColor: '#d32f2f',
  },
  cancelEmergencyButton: {
    backgroundColor: '#ffffff',
    color: '#d32f2f',
  },
  historyCard: {
    marginBottom: 16,
    elevation: 2,
  },
  divider: {
    marginVertical: 8,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1976d2',
    marginTop: 4,
    marginRight: 8,
  },
  historyContent: {
    flex: 1,
  },
  historyTime: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyCoordinates: {
    fontSize: 12,
    color: '#757575',
  },
  privacyCard: {
    marginBottom: 16,
    elevation: 1,
  },
});

export default GeolocationScreen;
