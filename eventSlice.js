import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/event/all';

const initialState = {
  events: [],
  status: 'idle',
  error: null,
  lastUpdated: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({query}) => {
    let url = API_URL;
    console.log("called")
    try {
      console.log("Fetching events with query:", url); 
      const response = await axios.get(url);
      console.log(response.data.events);

      return response.data.events;
    } catch (e) {
      console.error('Error fetching events:', e); 
      return rejectWithValue(e.response?.data || 'Error fetching events');
    }
  }
);


const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default eventsSlice.reducer;
