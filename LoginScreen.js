import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// This is a mockup of what the actual implementation would look like
// In a real app, we would use libraries like react-native-biometrics
const BiometricAuth = () => {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const checkBiometricAvailability = () => {
    // In a real implementation, we would check if the device supports biometrics
    // For the prototype, we'll assume it's available
    setIsBiometricAvailable(true);
  };
  
  const authenticateWithBiometrics = () => {
    // In a real implementation, this would trigger the device's biometric prompt
    Alert.alert(
      "Biometric Authentication",
      "Simulating fingerprint/face authentication",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Authenticate",
          onPress: () => {
            setIsAuthenticated(true);
            Alert.alert("Success", "Biometric authentication successful");
          }
        }
      ]
    );
  };
  
  useEffect(() => {
    checkBiometricAvailability();
  }, []);
  
  return (
    <View style={styles.biometricContainer}>
      <TouchableOpacity 
        style={styles.biometricButton}
        onPress={authenticateWithBiometrics}
      >
        <Icon name="fingerprint" size={40} color="#1976d2" />
        <Text style={styles.biometricText}>Authenticate with Biometrics</Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (username === 'officer' && password === 'password') {
        Alert.alert("Success", "Login successful");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    }, 1500);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} 
            style={styles.logo}
          />
          <Text style={styles.title}>Jamaica Constabulary Force</Text>
          <Text style={styles.subtitle}>Workforce Management System</Text>
        </View>
        
        <View style={styles.formContainer}>
          <TextInput
            label="Badge Number / Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          
          <Button 
            mode="contained" 
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          >
            Login
          </Button>
          
          <Text style={styles.orText}>OR</Text>
          
          <BiometricAuth />
        </View>
        
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Having trouble logging in? Contact support.
          </Text>
          <Text style={styles.versionText}>
            Version 1.0.0
          </Text>
        </View>
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
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#1976d2',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#757575',
  },
  biometricContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  biometricButton: {
    alignItems: 'center',
    padding: 15,
  },
  biometricText: {
    marginTop: 10,
    color: '#1976d2',
    fontSize: 16,
  },
  footerContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#757575',
    marginBottom: 5,
  },
  versionText: {
    color: '#9e9e9e',
    fontSize: 12,
  },
});

export default LoginScreen;
