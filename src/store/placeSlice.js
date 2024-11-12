// src/store/placeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

// 공유받은 여행 목록을 가져오는 Thunk
export const fetchSharedTripPlans = createAsyncThunk(
  'places/fetchSharedTripPlans',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://15.164.142.129:3001/api/user/${userId}/shared_trip_plans`);
      const data = await response.json();
      if (response.ok) {
        return data.data; // 여행 목록 반환
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const placeSlice = createSlice({
  name: 'places',
  initialState: {
    tripData: {
      tripTitle: '',
      destination: '',
      startDate: null,
      endDate: null,
      dayCount: 0,
      route_shared: false,
    },
    selectedPlaces: [],
    tripList: [], // 여행 목록 상태
    currentTripId: null, // 선택된 여행 ID 상태
  },
  reducers: {

    setCurrentTripId: (state, action) => {
      state.currentTripId = action.payload
    },

    // 여행 정보와 장소 초기 설정
    addTripData: (state, action) => {
      const { tripData, places } = action.payload;
      const { startDate, endDate } = tripData;

      const dayCount = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
      state.tripData = { ...tripData, dayCount };
      state.selectedPlaces = Array.from({ length: dayCount }, () => []);

      if (places) {
        places.forEach((place) => state.selectedPlaces[0].push(place));
      }
    },

    // 여행 정보 업데이트
    updateTripData: (state, action) => {
      state.tripData = { ...state.tripData, ...action.payload };
    },

    // 새로운 장소 추가
    addPlace: (state, action) => {
      const { dayIndex, newPlace } = action.payload;
      state.selectedPlaces[dayIndex].push(newPlace);
    },

    // 장소 삭제
    removePlace: (state, action) => {
      const { dayIndex, placeId } = action.payload;
      state.selectedPlaces[dayIndex] = state.selectedPlaces[dayIndex].filter(
        (place) => place.place_id !== placeId
      );
    },

    // 장소 순서 업데이트
    updatePlaceOrder: (state, action) => {
      const { dayIndex, orderedPlaces } = action.payload;
      state.selectedPlaces[dayIndex] = orderedPlaces;
    },

    // 여행 정보와 장소 목록 초기화
    resetTripData: (state) => {
      state.tripData = {
        tripTitle: '',
        destination: '',
        startDate: null,
        endDate: null,
        dayCount: 0,
        route_shared: false,
      };
      state.selectedPlaces = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSharedTripPlans.fulfilled, (state, action) => {
        state.tripList = action.payload  // 여행 목록 저장
      })
  },
});

export const { setCurrentTripId, addTripData, updateTripData, addPlace, removePlace, updatePlaceOrder, resetTripData } = placeSlice.actions;
export default placeSlice.reducer;
