// src/components/Planning/MapLoader.jsx
import React from "react";
import { LoadScript } from "@react-google-maps/api";
import MapView from "./MapView";  // MapView 컴포넌트 불러오기

const GOOGLE_MAPS_API_KEY = 'AIzaSyBw4Fa8qjscS_6f0EU_5mfzOx0OxIjpldI'; // 발급받은 API 키
const LIBRARIES = ["marker"]; // 고정된 라이브러리 설정

const MapLoader = () => (
  <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
    <MapView /> {/* MapView 컴포넌트를 LoadScript 내부에 포함 */}
  </LoadScript>
);

export default MapLoader;