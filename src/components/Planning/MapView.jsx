import React from "react";
import styled from "styled-components";
import { GoogleMap } from "@react-google-maps/api";
import { useSelector } from "react-redux";

const containerStyle = {
    width: '100%',
    height: '800px', // 지도 높이는 적당히 설정
};
const seoulCenter = {
    lat: 37.5665, // 서울의 위도
    lng: 126.978, // 서울의 경도
};

const MapView = () => {

    const selectedPlaces = useSelector((state) => state.selectedPlaces)

    const onLoad = (map) => {
        selectedPlaces.forEach((place) => {
          new window.google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat: place.location.lat, lng: place.location.lng },
            title: place.name,
          });
        });
      };

    return (
        <MapContainer>
          <GoogleMap mapContainerStyle={containerStyle} center={seoulCenter} zoom={13} onLoad={onLoad}>
            {/* 지도에 마커를 추가하므로 GoogleMap 내부에 추가 요소가 필요 없습니다 */}
          </GoogleMap>
      </MapContainer>
    )
}

export default MapView

const MapContainer = styled.section`
  width: 49%;
  height: auto;
  @media (max-width: 991px) {
    width: 100%;
    margin-top: 20px;
  }
`;


