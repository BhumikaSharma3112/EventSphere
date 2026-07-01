import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Async Thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const response = await API.get('/events', { params: queryParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/events/${id}`);
      return response.data.event;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event details');
    }
  }
);

export const createNewEvent = createAsyncThunk(
  'events/create',
  async (eventFormData, { rejectWithValue }) => {
    try {
      const response = await API.post('/events', eventFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.event;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateExistingEvent = createAsyncThunk(
  'events/update',
  async ({ id, eventFormData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/events/${id}`, eventFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.event;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/events/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/events/categories');
      return response.data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const initialState = {
  events: [],
  currentEvent: null,
  categories: [],
  page: 1,
  pages: 1,
  totalEvents: 0,
  loading: false,
  error: null
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.totalEvents = action.payload.total;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Event
      .addCase(createNewEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createNewEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
