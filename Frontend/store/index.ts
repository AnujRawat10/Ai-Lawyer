import { configureStore } from "@reduxjs/toolkit";
import currentChatDetail from "./currentChatDetail";
import conversationsReducer from "./conversationsSlice";

const store = configureStore({
  reducer: {
    chatDetail: currentChatDetail,
    conversations: conversationsReducer,
  },
});

export default store;
export type appDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
