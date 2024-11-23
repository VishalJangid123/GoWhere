// store.js
import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './eventSlice';

const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
});

export default store;
