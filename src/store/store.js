// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tripReducer from './tripPlanSlice'
import selectedPlacesReducer from './selectedPlacesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,  // userSlice 추가
    selectedPlaces: selectedPlacesReducer,  // selectedPlacesSlice 추가
    tripPlan: tripReducer,
  },
});
