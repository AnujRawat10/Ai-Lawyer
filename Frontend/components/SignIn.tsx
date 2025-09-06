import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = "https://ailawyerbackend.onrender.com";

const SignIn: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!mobile) {
      Alert.alert("Error", "Please enter your mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/mobile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (response.status === 404) {
        setIsRegistering(true);
      } else if (response.ok) {
        setShowOtpInput(true);
        Alert.alert("Success", "OTP sent to your mobile number");
      } else {
        Alert.alert("Error", data.msg || "Something went wrong");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to connect to server");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!mobile || !name || !address) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, name, address }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpInput(true);
        Alert.alert("Success", "OTP sent to your mobile number");
      } else {
        Alert.alert("Error", data.msg || "Something went wrong");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to connect to server");
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegistering ? "register/verify" : "verify";
      const response = await fetch(`${BACKEND_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token
        await AsyncStorage.setItem("token", data.token);
        navigation.navigate("ChatApp" as never);
      } else {
        Alert.alert("Error", data.msg || "Invalid OTP");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to connect to server");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size='large' color='#60A5FA' />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {isRegistering ? "Register" : "Sign In"}
          </Text>

          {!showOtpInput ? (
            <>
              <TextInput
                style={styles.input}
                placeholder='Mobile Number'
                value={mobile}
                onChangeText={setMobile}
                keyboardType='phone-pad'
                placeholderTextColor='#94A3B8'
              />

              {isRegistering && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor='#94A3B8'
                  />
                  <TextInput
                    style={styles.input}
                    placeholder='Address'
                    value={address}
                    onChangeText={setAddress}
                    placeholderTextColor='#94A3B8'
                  />
                </>
              )}

              <TouchableOpacity
                style={styles.button}
                onPress={isRegistering ? handleRegister : handleLogin}
              >
                <Text style={styles.buttonText}>
                  {isRegistering ? "Register" : "Get OTP"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder='Enter OTP'
                value={otp}
                onChangeText={setOtp}
                keyboardType='numeric'
                placeholderTextColor='#94A3B8'
              />
              <TouchableOpacity style={styles.button} onPress={verifyOTP}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#1E293B",
    width: "90%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#F1F5F9",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#334155",
    borderWidth: 1,
    borderColor: "#475569",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    color: "#F1F5F9",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
  loadingIndicator: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  loadingText: {
    color: "#60A5FA",
    marginTop: 12,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});

export default SignIn;
