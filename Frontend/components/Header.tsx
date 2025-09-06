import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  onMenuPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <BlurView intensity={90} tint='dark' style={styles.header}>
        <LinearGradient
          colors={["rgba(30, 41, 59, 0.9)", "rgba(15, 23, 42, 0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onMenuPress}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#4F46E5", "#3B82F6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menuButtonGradient}
            >
              <Ionicons name='menu-outline' size={22} color='#F8FAFC' />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <View style={styles.titleWrapper}>
              <Text style={styles.title} numberOfLines={1}>
                AI Legal Assistant
              </Text>
              <View style={styles.badgeContainer}>
                <LinearGradient
                  colors={["#3B82F6", "#4F46E5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.badge}
                >
                  <Text style={styles.badgeText}>PRO</Text>
                </LinearGradient>
              </View>
            </View>
            <Text style={styles.subtitle}>Professional Legal Guidance</Text>
          </View>
        </LinearGradient>
      </BlurView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent",
    zIndex: 100,
  },
  header: {
    height: Platform.OS === "ios" ? 120 : 90,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
  },
  headerGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(59, 130, 246, 0.15)",
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  menuButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    color: "#F8FAFC",
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  badgeContainer: {
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  badgeText: {
    color: "#F8FAFC",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});

export default Header;