import React, { useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Response from "./Response";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

interface Message {
  user: string;
  mark: { elementText: string; text: string }[];
}

const Body: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { currentConversation } = useSelector(
    (state: RootState) => state.conversations
  );
  const isFetching = useSelector(
    (state: RootState) => state.chatDetail.isFetching
  );

  // Create message animations using useMemo
  const messageAnims = useMemo(() => {
    if (!currentConversation?.messages) return {};
    return currentConversation.messages.reduce((acc, _, index) => {
      acc[index] = new Animated.Value(0);
      return acc;
    }, {} as { [key: number]: Animated.Value });
  }, [currentConversation?.messages.length]);

  // Handle all message animations in a single useEffect
  useEffect(() => {
    const animations = Object.values(messageAnims).map((anim) =>
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      })
    );

    Animated.stagger(100, animations).start();

    return () => {
      Object.values(messageAnims).forEach((anim) => anim.setValue(0));
    };
  }, [messageAnims]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentConversation]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [currentConversation?.messages]);

  const renderMessageBubble = (item: Message, index: number) => {
    const isAI = item.user === "AI";
    const bubbleStyle = isAI ? styles.aiBubble : styles.userBubble;
    const contentStyle = isAI ? styles.aiContent : styles.userContent;
    const messageAnim = messageAnims[index];

    return (
      <Animated.View
        key={index}
        style={[
          styles.messageContainer,
          isAI ? styles.aiContainer : styles.userContainer,
          {
            opacity: messageAnim,
            transform: [
              {
                translateY: messageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        {isAI && (
          <View style={styles.avatarContainer}>
            <BlurView intensity={80} style={styles.avatarBlur}>
              <Text style={styles.avatarText}>AI</Text>
            </BlurView>
          </View>
        )}
        <View style={[styles.bubble, bubbleStyle]}>
          {isAI ? (
            <Response mark={item.mark} />
          ) : (
            <Text style={contentStyle}>{item.user}</Text>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={["#0F172A", "#1E293B"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.container,
          !currentConversation?.messages.length && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {currentConversation?.messages.map((item: Message, index: number) =>
          renderMessageBubble(item, index)
        )}

        {isFetching && (
          <View style={styles.loadingContainer}>
            <BlurView intensity={80} style={styles.loadingBlur}>
              <ActivityIndicator size='small' color='#60A5FA' />
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </BlurView>
          </View>
        )}

        {!currentConversation?.messages.length && !isFetching && (
          <View style={styles.emptyStateContainer}>
            <LinearGradient
              colors={["rgba(59, 130, 246, 0.1)", "rgba(37, 99, 235, 0.1)"]}
              style={styles.emptyStateGradient}
            >
              <Text style={styles.emptyStateTitle}>
                Welcome to AI Legal Assistant
              </Text>
              <Text style={styles.emptyStateText}>
                Ask any legal question and get professional assistance
                instantly.
              </Text>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: "#0A0F1A",
  },
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: Dimensions.get("window").height - 160,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    opacity: 0.98,
  },
  aiContainer: {
    marginRight: 48,
  },
  userContainer: {
    marginLeft: 48,
    justifyContent: "flex-end",
  },
  avatarContainer: {
    marginRight: 8,
    marginTop: 4,
  },
  avatarBlur: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  avatarText: {
    color: "#60A5FA",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  bubble: {
    borderRadius: 20,
    padding: 12,
    maxWidth: "85%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  aiBubble: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.1)",
  },
  userBubble: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  aiContent: {
    color: "#F8FAFC",
  },
  userContent: {
    color: "#F8FAFC",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  loadingBlur: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  loadingText: {
    marginLeft: 8,
    color: "#60A5FA",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  emptyStateContainer: {
    paddingHorizontal: 20,
  },
  emptyStateGradient: {
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    ...Platform.select({
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F8FAFC",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.4,
  },
  emptyStateText: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.3,
    maxWidth: 280,
  },
});

export default Body;