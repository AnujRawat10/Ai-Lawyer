import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = "https://ailawyerbackend.onrender.com";

interface Message {
  user: string;
  mark: { elementText: string; text: string }[];
  timestamp: string;
}

interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ConversationsState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConversationsState = {
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  "conversations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/conversations`, {
        headers: {
          "x-auth-token": token || "",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch conversations");
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createConversation = createAsyncThunk(
  "conversations/create",
  async (title: string, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/api/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error("Failed to create conversation");
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMessageToConversation = createAsyncThunk(
  "conversations/addMessage",
  async (
    {
      conversationId,
      message,
    }: {
      conversationId: string;
      message: { user: string; mark: { elementText: string; text: string }[] };
    },
    { rejectWithValue }
  ) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token || "",
          },
          body: JSON.stringify(message),
        }
      );
      if (!response.ok) throw new Error("Failed to add message");
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setCurrentConversation(state, action) {
      state.currentConversation = action.payload;
    },
    clearCurrentConversation(state) {
      state.currentConversation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.currentConversation = action.payload;
      })
      .addCase(addMessageToConversation.fulfilled, (state, action) => {
        state.currentConversation = action.payload;
        const index = state.conversations.findIndex(
          (conv) => conv._id === action.payload._id
        );
        if (index !== -1) {
          state.conversations[index] = action.payload;
        }
      });
  },
});

export const { setCurrentConversation, clearCurrentConversation } =
  conversationsSlice.actions;
export default conversationsSlice.reducer;
