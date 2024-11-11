// src/store/placeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const placeSlice = createSlice({
  name: 'places',
  initialState: {
    tripData: {},
    selectedPlaces: [],
  },
  reducers: {
    addTripData: (state, action) => {
      const { tripData, places } = action.payload;

      if (!tripData) {
        console.error("addTripData 액션에 tripData가 포함되지 않았습니다.");
        return;
      }

      const { startDate, endDate, tripTitle, destination, route_shared } = tripData;

      // startDate와 endDate로부터 dayCount 계산
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const dayCount = end.diff(start, 'day') + 1;

      // tripData 전체 객체를 state에 저장
      state.tripData = { ...tripData, dayCount, route_shared: tripData.route_shared };
      state.selectedPlaces = Array.from({ length: dayCount }, () => []);

      if (places && Array.isArray(places)) {
        places.forEach((place) => {
          state.selectedPlaces[0].push(place); // DAY 1에 기본적으로 추가
        });
      } else {
        console.warn("addTripData 액션에 places 배열이 포함되지 않았습니다.");
      }
    },

    updateTripData: (state, action) => {
      state.tripData = { ...state.tripData, ...action.payload };
    },

    addPlace: (state, action) => {
      const { dayIndex, newPlace } = action.payload;
      if (!state.selectedPlaces[dayIndex]) {
        state.selectedPlaces[dayIndex] = [];
      }
      state.selectedPlaces[dayIndex].push(newPlace);
    },
    removePlace: (state, action) => {
      const { dayIndex, placeId } = action.payload;
      state.selectedPlaces[dayIndex] = state.selectedPlaces[dayIndex].filter(
        (place) => place.place_id !== placeId
      );
    },
    updatePlaceOrder: (state, action) => {
      const { dayIndex, orderedPlaces } = action.payload;
      state.selectedPlaces[dayIndex] = orderedPlaces;
    },
  },
});

export const { addTripData, addPlace, updateTripData, removePlace, updatePlaceOrder } = placeSlice.actions;
export default placeSlice.reducer;
