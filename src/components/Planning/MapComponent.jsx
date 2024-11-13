//#구글 지도 라이브러리 설치
//yarn add @react-google-maps/api
//--------------------------------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GoogleMap, LoadScript, Marker, MarkerF } from '@react-google-maps/api';
import { useSelector } from 'react-redux'; // useSelector 임포트

const MapComponent = ({ selectedPlaces }) => {
    // Redux에서 API 키를 불러옵니다
    const apiKey = useSelector(state => state.map.googleMapApiKey);  // 스토어에서 API 키 가져오기

    const containerStyle = {
        width: '100%',
        height: '800px', // 지도 높이는 적당히 설정
    };

    const mapOptions = {
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    };

    const colors = ["red", "blue", "green", "purple", "orange", "yellow"];
    
    // 첫 번째 장소가 있으면 그 좌표를 중심으로 설정, 없으면 서울 좌표로 기본 설정
    const [mapCenter, setMapCenter] = useState(
        selectedPlaces.length > 0
            ? { lat: selectedPlaces[0].lat, lng: selectedPlaces[0].lng }
            : { lat: 37.5665, lng: 126.9780 }
    );
    const [mapZoom, setMapZoom] = useState(10);

    useEffect(() => {
        // 첫 번째 장소가 있는 경우 지도 중심과 줌 레벨을 해당 장소로 설정
        if (selectedPlaces.length > 0 && selectedPlaces[0].lat && selectedPlaces[0].lng) {
            setMapCenter({
                lat: selectedPlaces[0].lat,
                lng: selectedPlaces[0].lng,
            });
            setMapZoom(15); // 첫 장소에 맞는 줌 레벨 설정
        } else {
            // 장소가 없을 경우 기본 중심과 줌으로 돌아감
            setMapCenter({ lat: 37.5665, lng: 126.9780 });
            setMapZoom(12);
        }
    }, [selectedPlaces]);

  return (
    <MapContainer>
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={mapZoom}
                options={mapOptions}
            >
                {selectedPlaces.map((place, index) => (
                    place.lat && place.lng ? (
                        <MarkerF
                            key={place.place_id}
                            position={{ lat: place.lat, lng: place.lng }}
                            label={{
                                text: `${index + 1}`,
                                color: "white",
                                fontSize: "12px",
                            }}
                            icon={{
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                    fillColor: colors[(place.trip_day - 1) % colors.length],  // trip_day 값에 따라 색상 변경
                                fillOpacity: 1,
                                strokeWeight: 1,
                            }}
                            />
                        ) : null
                ))}
            </GoogleMap>
        </LoadScript>
    </MapContainer>
  );    
};

const MapContainer = styled.section`
    width: 100%;
    height: auto;
    @media (max-width: 991px) {
        width: 100%;
        margin-top: 20px;
    }
`;

export default MapComponent;