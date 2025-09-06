import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from "react-native";
import { useDispatch } from "react-redux";
import { appDispatch } from "../store";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import { Sidebar } from "./Sidebar";
import { fetchConversations } from "../store/conversationsSlice";
import { BlurView } from "expo-blur";

const ChatApp: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch<appDispatch>();

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? 0 : 1;
    setIsSidebarOpen(!isSidebarOpen);

    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  };

  const mainContentStyle = {
    transform: [
      {
        translateX: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Platform.OS === "ios" ? 280 : 260],
        }),
      },
    ],
    borderRadius: slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 20],
    }),
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Animated.View style={[styles.mainContent, mainContentStyle]}>
        <Header onMenuPress={toggleSidebar} />
        <Body />
        <Footer />
      </Animated.View>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        slideAnim={slideAnim}
      />

      {isSidebarOpen && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.7],
                }),
              },
            ]}
          >
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#0F172A",
    overflow: "hidden",
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  keyboard: {
    backgroundColor: "#1E293B",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
});

export default ChatApp;