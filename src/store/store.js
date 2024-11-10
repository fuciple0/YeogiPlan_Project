// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tripReducer from './tripPlanSlice'
import placeReducer from './placeSlice';  // placeReducer 추가

export const store = configureStore({
  reducer: {
    user: userReducer,  // userSlice 추가
    tripPlan: tripReducer,
    places: placeReducer,
  },
});
