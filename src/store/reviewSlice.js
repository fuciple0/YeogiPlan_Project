import { createSlice } from '@reduxjs/toolkit';

export const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    placeData: {
      placeId: null,
      placeName: null,
    },
    rating: 0,
  },
  reducers: {
    setPlaceData: (state, action) => {
      state.placeData = {
        placeId: action.payload.place_id,
        placeName: action.payload.place_name,
      };
    },
    clearPlaceData: (state) => {
      state.placeData = {
        placeId: null,
        placeName: null,
      };
    },
    clearRating: (state) => {
        state.rating = 0;
    },
    setRating: (state, action) => {
        state.rating = action.payload;
      },
  },
});

export const { setPlaceData, setRating, clearPlaceData, clearRating } = reviewSlice.actions;
export default reviewSlice.reducer;