// src/store/mapApiKey.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    googleMapApiKey: 'AIzaSyBHmojEymbks2VERgqeBFHNw-MbHPBku3g', // API 키 하드코딩
};

// Slice 정의
const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        // API 키를 업데이트하는 리듀서 추가 (필요한 경우)
        setApiKey: (state, action) => {
            state.googleMapApiKey = action.payload;
        },
    },
});

// 액션과 리듀서를 내보냄
export const { setApiKey } = mapSlice.actions;
export default mapSlice.reducer;