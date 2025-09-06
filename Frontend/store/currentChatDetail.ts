import { createSlice } from "@reduxjs/toolkit";

interface ChatDetailItem {
  user: string;
  mark: { elementText: string; text: string }[];
}

interface CurrentChatDetailState {
  chatDetail: ChatDetailItem[];
  isFetching: boolean;
}

const initialState: CurrentChatDetailState = {
  chatDetail: [],
  isFetching: false,
};

const currentChatDetail = createSlice({
  name: "currentChatDetail",
  initialState,
  reducers: {
    addToChatHistory(state, action) {
      const question: string = action.payload.question;
      const response: { elementText: string; text: string }[] = [];
      let answer: string[] = action.payload.answer.split("\n");

      answer.forEach((paragraph) => {
        if (paragraph.trim()) {
          response.push({
            elementText: "paragraph",
            text: paragraph,
          });
        }
      });

      state.chatDetail.push({ user: question, mark: response });
    },
    setIsFetchingTrue(state) {
      state.isFetching = true;
    },
    setIsFetchingFalse(state) {
      state.isFetching = false;
    },
  },
});

export const currentChatDetailActions = currentChatDetail.actions;
export default currentChatDetail.reducer;