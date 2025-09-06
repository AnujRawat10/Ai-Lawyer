import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchLegalAdvice } from "../store/chatActions";
import {
  addMessageToConversation,
  createConversation,
} from "../store/conversationsSlice";
import { appDispatch, RootState } from "../store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const Footer: React.FC = () => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<appDispatch>();
  const { currentConversation } = useSelector(
    (state: RootState) => state.conversations
  );
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!value.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      let targetConversation = currentConversation;
      if (!targetConversation) {
        const result = await dispatch(
          createConversation(value.substring(0, 50) + "...")
        ).unwrap();
        targetConversation = result;
      }

      if (!targetConversation) {
        throw new Error("Failed to create or get conversation");
      }

      const userMessage = {
        user: value,
        mark: [{ elementText: "paragraph", text: value }],
      };

      const inputValue = value;
      setValue("");
      Keyboard.dismiss();

      await dispatch(
        addMessageToConversation({
          conversationId: targetConversation._id,
          message: userMessage,
        })
      ).unwrap();

      await dispatch(fetchLegalAdvice(inputValue));
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Please try again.");
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <BlurView intensity={85} tint='dark' style={styles.footerContainer}>
        <LinearGradient
          colors={["rgba(30, 41, 59, 0.95)", "rgba(15, 23, 42, 0.95)"]}
          style={styles.footerGradient}
        >
          <View style={styles.inputContainer}>
            <BlurView
              intensity={40}
              tint='dark'
              style={styles.textInputWrapper}
            >
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={setValue}
                placeholder='Ask any legal question...'
                placeholderTextColor='#64748B'
                multiline
                maxLength={1000}
                selectionColor='#60A5FA'
                editable={!isSubmitting}
              />
            </BlurView>

            <Animated.View
              style={[
                styles.sendButtonContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <TouchableOpacity
                onPress={animateButton}
                activeOpacity={0.75}
                disabled={!value.trim() || isSubmitting}
                style={[
                  styles.sendButton,
                  (!value.trim() || isSubmitting) && styles.sendButtonDisabled,
                ]}
              >
                <LinearGradient
                  colors={
                    value.trim() && !isSubmitting
                      ? ["#4F46E5", "#3B82F6"]
                      : ["#334155", "#1E293B"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sendButtonGradient}
                >
                  {isSubmitting ? (
                    <Animated.View style={{ opacity: scaleAnim }}>
                      <Ionicons
                        name='ellipsis-horizontal'
                        size={20}
                        color='#60A5FA'
                      />
                    </Animated.View>
                  ) : (
                    <Ionicons
                      name='send'
                      size={18}
                      color={value.trim() ? "#F8FAFC" : "#64748B"}
                    />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.suggestionContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionScrollContent}
            >
              <TouchableOpacity
                style={styles.suggestionButton}
                activeOpacity={0.7}
                onPress={() => setValue("What are my rights as a tenant?")}
              >
                <Text style={styles.suggestionText}>Rights as tenant</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionButton}
                activeOpacity={0.7}
                onPress={() => setValue("How do I file a small claims case?")}
              >
                <Text style={styles.suggestionText}>Small claims</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionButton}
                activeOpacity={0.7}
                onPress={() => setValue("Explain contract termination clauses")}
              >
                <Text style={styles.suggestionText}>Contracts</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionButton}
                activeOpacity={0.7}
                onPress={() => setValue("What are my employment rights?")}
              >
                <Text style={styles.suggestionText}>Employment law</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </LinearGradient>
      </BlurView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(59, 130, 246, 0.15)",
  },
  footerGradient: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInputWrapper: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    overflow: "hidden",
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    color: "#F8FAFC",
    fontSize: 15,
    maxHeight: 120,
    minHeight: 42,
    fontWeight: "400",
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  sendButtonContainer: {
    marginLeft: 10,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sendButtonDisabled: {
    borderColor: "rgba(71, 85, 105, 0.3)",
  },
  sendButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionContainer: {
    marginTop: 12,
  },
  suggestionScrollContent: {
    paddingRight: 20,
    paddingBottom: 4,
  },
  suggestionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
    marginRight: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  suggestionText: {
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "500",
  },
});

export default Footer;
