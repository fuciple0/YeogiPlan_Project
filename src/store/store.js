// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tripReducer from './tripPlanSlice'
import placeReducer from './placeSlice';  // placeReducer 추가
import mapReducer from './mapSlice2';  // mapStore 추가
import reviewReducer from './reviewSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,  // userSlice 추가
    tripPlan: tripReducer,
    places: placeReducer,
    map: mapReducer,
    review: reviewReducer, // review 슬라이스 추가
  },
});
