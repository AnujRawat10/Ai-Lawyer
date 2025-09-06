import { ThunkAction } from "@reduxjs/toolkit";
import { currentChatDetailActions } from "./currentChatDetail";
import { addMessageToConversation } from "./conversationsSlice";
import { RootState } from "./index";

export const fetchLegalAdvice = (
  query: string
): ThunkAction<Promise<void>, RootState, void, any> => {
  return async (dispatch, getState) => {
    dispatch(currentChatDetailActions.setIsFetchingTrue());

    try {
      const apiKey =
        process.env.VITE_API_KEY || "3hvoSZUH.cb8BRALRo3F7gEEUo5mUIkBl4GAblKJp";
      const channelToken = process.env.VITE_CHANNEL_TOKEN || "first";
      const url = `https://payload.vextapp.com/hook/WH1DJ41NW2/catch/${channelToken}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Apikey: `Api-Key ${apiKey}`,
        },
        body: JSON.stringify({ payload: query }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      // Create a properly formatted AI response
      const aiMessage = {
        user: "AI",
        mark: [{ elementText: "paragraph", text: data.text }],
      };

      // Add AI response to current conversation
      const state = getState();
      const currentConversation = state.conversations.currentConversation;

      if (currentConversation) {
        await dispatch(
          addMessageToConversation({
            conversationId: currentConversation._id,
            message: aiMessage,
          })
        ).unwrap();
      }

      dispatch(
        currentChatDetailActions.addToChatHistory({
          question: query,
          answer: data.text,
        })
      );
    } catch (error) {
      console.error("Error in fetchLegalAdvice:", error);
      throw error;
    } finally {
      dispatch(currentChatDetailActions.setIsFetchingFalse());
    }
  };
};
