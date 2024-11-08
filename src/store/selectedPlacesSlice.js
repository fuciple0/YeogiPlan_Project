import { createSlice } from "@reduxjs/toolkit";

const selectedPlacesSlice = createSlice({
    name: 'selectedPlaces',
    initialState: [],
    reducers: {
        addPlace: (state, action) => {
            state.push(action.payload);
        },
        clearPlaces: () => [],  // 선택 목록 초기화
    }
});

export const { addPlace, clearPlaces } = selectedPlacesSlice.actions
export default selectedPlacesSlice.reducer