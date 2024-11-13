import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

// 여행 일정 세부 정보를 가져오는 비동기 액션
export const fetchTripDetails = createAsyncThunk(
  'places/fetchTripDetails',
  async (tripPlanId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://15.164.142.129:3001/api/trip_plan/${tripPlanId}/details`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch trip details');
      }
      console.log("data: ", data)
      // 장소마다 경도와 위도를 가져오는 API 호출
      const updatedPlaces = await Promise.all(data.data.map(async (place) => {
        const locationResponse = await fetch(`http://43.201.36.203:3001/googleApi/keywordSearch?searchTerm=${place.place_name}`);
        const locationData = await locationResponse.json();
        console.log("locationData: ", locationData)
        
        if (locationData.places && locationData.places.length > 0) {
          place.lat = locationData.places[0].location.lat;
          place.lng = locationData.places[0].location.lng;
        }
        
        return place;
      }));
      // 업데이트 된 장소 정보를 Redux 상태에 저장
      console.log("업데이트된 장소들:", updatedPlaces);  // 경도와 위도가 포함된 장소들 출력

      return updatedPlaces
      // return data.data; // 서버에서 받은 장소 목록 데이터
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

    // 현재 여행 정보를 tripData로 설정하는 액션
    updateTripData: (state, action) => {
      state.tripData = { ...state.tripData, ...action.payload };
    },

    setCurrentTripId: (state, action) => {
      state.currentTripId = action.payload;
    },
    
    addPlace: (state, action) => {
      const { dayIndex, newPlace } = action.payload;
      state.selectedPlaces[dayIndex].push(newPlace);
    },
    // 새로운 액션을 추가: 여행 데이터와 장소들을 Redux에 저장
    addTripData: (state, action) => {
      state.tripData = action.payload.tripData;  // 여행 데이터
      state.selectedPlaces = action.payload.places;  // 선택된 장소들
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSharedTripPlans.fulfilled, (state, action) => {
        console.log("API로부터 받은 여행 목록 데이터:", action.payload);

        state.tripList = action.payload;
      })
      .addCase(fetchTripDetails.fulfilled, (state, action) => {
        state.selectedPlaces = action.payload;
      });
  }
});

export const { setCurrentTripId, updateTripData, addPlace, addTripData } = placeSlice.actions;
export default placeSlice.reducer;
