import React, { useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState, appDispatch } from "../store";
import {
  setCurrentConversation,
  createConversation,
} from "../store/conversationsSlice";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";

interface Conversation {
  _id: string;
  title: string;
  messages: Array<{
    user: string;
    mark: Array<{ elementText: string; text: string }>;
  }>;
  updatedAt: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  slideAnim,
}) => {
  const dispatch = useDispatch<appDispatch>();
  const { conversations, currentConversation } = useSelector(
    (state: RootState) => state.conversations
  );

  const itemAnims = useMemo(() => {
    return conversations.reduce((acc, conversation) => {
      acc[conversation._id] = new Animated.Value(0);
      return acc;
    }, {} as { [key: string]: Animated.Value });
  }, [conversations.map((c) => c._id).join(",")]);

  useEffect(() => {
    const animations = Object.values(itemAnims).map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      })
    );

    Animated.stagger(50, animations).start();

    return () => {
      Object.values(itemAnims).forEach((anim) => anim.setValue(0));
    };
  }, [itemAnims]);

  const handleNewChat = () => {
    dispatch(createConversation("New Chat"));
    onClose();
  };

  const handleSelectConversation = (conversation: Conversation) => {
    dispatch(setCurrentConversation(conversation));
    onClose();
  };

  const getConversationPreview = (conversation: Conversation) => {
    if (conversation.messages.length > 0) {
      const lastMessage = conversation.messages[0];
      return (
        lastMessage.user.substring(0, 30) +
        (lastMessage.user.length > 30 ? "..." : "")
      );
    }
    return "New conversation";
  };

  const renderConversationItem = (conversation: Conversation) => {
    const itemAnim = itemAnims[conversation._id];

    return (
      <Animated.View
        key={conversation._id}
        style={{
          opacity: itemAnim,
          transform: [
            {
              translateX: itemAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={[
            styles.conversationItem,
            currentConversation?._id === conversation._id &&
              styles.activeConversation,
          ]}
          onPress={() => handleSelectConversation(conversation)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={
              currentConversation?._id === conversation._id
                ? ["rgba(59, 130, 246, 0.1)", "rgba(37, 99, 235, 0.1)"]
                : ["transparent", "transparent"]
            }
            style={styles.conversationGradient}
          >
            <FontAwesome
              name='comments'
              size={16}
              color={
                currentConversation?._id === conversation._id
                  ? "#60A5FA"
                  : "#94A3B8"
              }
              style={styles.conversationIcon}
            />
            <View style={styles.conversationContent}>
              <Text style={styles.conversationTitle} numberOfLines={1}>
                {conversation.title}
              </Text>
              <Text style={styles.conversationPreview} numberOfLines={1}>
                {getConversationPreview(conversation)}
              </Text>
              <Text style={styles.conversationDate}>
                {format(new Date(conversation.updatedAt), "MMM d, yyyy")}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-300, 0],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={["#1E293B", "#0F172A"]}
        style={styles.gradientContainer}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../assets/icon.png")}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.headerTitle}>AI Legal Assistant</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name='times' size={20} color='#94A3B8' />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.newChatButton}
          onPress={handleNewChat}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <FontAwesome name='plus' size={16} color='#F3F4F6' />
            <Text style={styles.newChatText}>New Chat</Text>
          </LinearGradient>
        </TouchableOpacity>

        <ScrollView
          style={styles.conversationList}
          showsVerticalScrollIndicator={false}
        >
          {conversations.map(renderConversationItem)}
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: Platform.OS === "ios" ? 280 : 260,
    backgroundColor: "rgba(15, 23, 42, 0.98)",
    borderRightWidth: 1,
    borderRightColor: "rgba(59, 130, 246, 0.1)",
    zIndex: 1000,
    overflow: "hidden",
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(59, 130, 246, 0.1)",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
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
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#F8FAFC",
    marginLeft: 12,
    letterSpacing: 0.4,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  newChatButton: {
    margin: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
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
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  newChatText: {
    color: "#F8FAFC",
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  conversationList: {
    flex: 1,
  },
  conversationItem: {
    marginHorizontal: 8,
    marginVertical: 3,
    borderRadius: 12,
    overflow: "hidden",
  },
  conversationGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.1)",
  },
  activeConversation: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  conversationIcon: {
    marginRight: 12,
    width: 20,
    textAlign: "center",
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F8FAFC",
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  conversationPreview: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 2,
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  conversationDate: {
    fontSize: 11,
    color: "#64748B",
    letterSpacing: 0.2,
  },
});