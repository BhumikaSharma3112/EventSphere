import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/notifications');
      return response.data.notifications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationsRead = createAsyncThunk(
  'notifications/markRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addSocketNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark as read
      .addCase(markNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  }
});

export const { addSocketNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
