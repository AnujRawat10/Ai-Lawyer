import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const LandingPage: React.FC = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const featureAnims = [
    useRef(new Animated.Value(50)).current,
    useRef(new Animated.Value(50)).current,
    useRef(new Animated.Value(50)).current,
  ];
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial fade-in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered feature animations
    featureAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 600,
        delay: 400 + index * 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });

    // Continuous pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSignIn = () => {
    navigation.navigate("SignIn" as never);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={[
          styles.heroContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View 
          style={[
            styles.logo,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.logoText}>AI</Text>
        </Animated.View>
        <Animated.Text 
          style={[
            styles.title,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          AI Lawyer
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.subtitle,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          The future of legal assistance is here. AI Lawyer provides smart,
          accurate, and fast legal advice for all your needs.
        </Animated.Text>
      </Animated.View>

      <View style={styles.featureList}>
        {[
          "24/7 availability for instant legal queries",
          "Cost-effective solutions for individuals and businesses",
          "Privacy and confidentiality guaranteed",
        ].map((feature, index) => (
          <Animated.View
            key={index}
            style={[
              styles.featureItem,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: featureAnims[index] },
                ],
              },
            ]}
          >
            <View style={styles.featureIcon}>
              <Text style={{ color: "#FFFFFF", fontSize: 18 }}>✓</Text>
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </Animated.View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignIn}
        activeOpacity={0.8}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </Animated.View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  heroContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 60,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3B82F6",
    ...Platform.select({
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoText: {
    color: "#F1F5F9",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#F1F5F9",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 26,
    letterSpacing: 0.3,
    maxWidth: 320,
  },
  featureList: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  featureIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: "#F1F5F9",
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default LandingPage;
