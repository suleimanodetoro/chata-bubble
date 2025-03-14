// components/ui/ChatInput.tsx
import { useState, useCallback, memo } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  View,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { useChatContext } from "../../contexts/ChatContext";
import { useAppStore } from "../../hooks/useAppStore";
import { OpenAIService } from "../../lib/services/openai";
import { Language, ChatMessage } from "../../types"; // Make sure ChatMessage is explicitly imported
import { StorageService } from "../../lib/services/storage";
import { generateId } from "@/lib/utils/ids";

interface ChatInputProps {
  sessionLanguage: Language | null;
  disabled?: boolean;
}

export const ChatInput = memo(function ChatInput({
  sessionLanguage,
  disabled = false,
}: ChatInputProps) {
  const [inputText, setInputText] = useState("");
  const { state, dispatch } = useChatContext();
  const { currentScenario, currentSession, setCurrentSession } = useAppStore();

  const handleSend = useCallback(async () => {
    if (
      !inputText.trim() ||
      state.isLoading ||
      !currentScenario ||
      !sessionLanguage ||
      disabled
    ) {
      return;
    }

    const trimmedText = inputText.trim();
    setInputText("");
    Keyboard.dismiss();

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Create initial user message with explicit type annotation
      const userMessage: ChatMessage = {
        id: generateId(),
        content: {
          original: trimmedText,
          translated: "Translating...",
        },
        sender: "user", // Use literal string "user"
        timestamp: Date.now(),
        isEdited: false,
      };

      dispatch({ type: "ADD_MESSAGE", payload: userMessage });

      // First translate user message
      const translatedUserText = await OpenAIService.translateText(
        trimmedText,
        sessionLanguage.name
      );

      // Update user message with translation
      const updatedUserMessage: ChatMessage = {
        ...userMessage,
        content: {
          original: trimmedText,
          translated: translatedUserText,
        },
      };

      dispatch({
        type: "UPDATE_MESSAGE",
        payload: {
          id: userMessage.id,
          message: updatedUserMessage,
        },
      });

      // Get AI response with updated messages
      const aiResponse = await OpenAIService.generateChatCompletion(
        [...state.messages, updatedUserMessage],
        currentScenario,
        sessionLanguage.name
      );

      // Translate AI response to English
      const translatedAiResponse = await OpenAIService.translateText(
        aiResponse,
        "English"
      );

      // Create and add AI message
      const aiMessage: ChatMessage = {
        id: generateId(),
        content: {
          original: aiResponse,
          translated: translatedAiResponse,
        },
        sender: "assistant", // Use literal string "assistant"
        timestamp: Date.now(),
        isEdited: false,
      };

      dispatch({ type: "ADD_MESSAGE", payload: aiMessage });

      // Update session
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          messages: [...state.messages, updatedUserMessage, aiMessage] as ChatMessage[], // Use type assertion
          lastUpdated: Date.now(),
        };
        // Log before saving
        console.log("Messages after adding:", {
          stateMessages: state.messages,
          sessionMessages: updatedSession.messages,
        });

        await StorageService.saveSession(updatedSession);
        setCurrentSession(updatedSession);
      }
    } catch (error) {
      console.error("Message error:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [
    inputText,
    state.messages,
    currentScenario,
    sessionLanguage,
    currentSession,
    dispatch,
    setCurrentSession,
    disabled,
  ]);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={inputText}
        onChangeText={setInputText}
        placeholder={disabled ? "Chat ended" : "Type a message..."}
        placeholderTextColor="#999"
        maxLength={1000}
        editable={!state.isLoading && !disabled}
        multiline
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      <Pressable
        onPress={handleSend}
        disabled={!inputText.trim() || state.isLoading || disabled}
        style={({ pressed }) => [
          styles.sendButton,
          (!inputText.trim() || state.isLoading || disabled) &&
            styles.sendButtonDisabled,
          pressed && styles.sendButtonPressed,
        ]}
      >
        <ThemedText style={styles.sendButtonText}>
          {state.isLoading ? "..." : "Send"}
        </ThemedText>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 8 : 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    backgroundColor: "#f2f2f7",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 8,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: "#F8F9FA",
    color: "#999",
  },
  sendButton: {
    height: 36,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonPressed: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});