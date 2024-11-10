// store/tripPlanSlice.js
import { createSlice } from "@reduxjs/toolkit";

const tripPlanSlice = createSlice({
    name: "tripPlan",
    initialState: {
        planData: null, // trip plan 정보를 저장할 상태
    },
    reducers: {
        setTripPlan: (state, action) => {
            state.planData = action.payload;
        },
    },
});

export const { setTripPlan } = tripPlanSlice.actions;
export default tripPlanSlice.reducer;
