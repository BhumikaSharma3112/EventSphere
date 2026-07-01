import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    notifications: notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
