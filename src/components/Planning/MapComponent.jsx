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

    // 첫 번째 장소가 있으면 그 좌표를 중심으로 설정, 없으면 서울 좌표로 기본 설정
    const defaultCenter = selectedPlaces[0]?.[0]
        ? { lat: selectedPlaces[0][0].location.lat, lng: selectedPlaces[0][0].location.lng }
        : { lat: 37.5665, lng: 126.9780 };

    const mapOptions = {
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    };

    const colors = ["red", "blue", "green"];
    
    // 초기 center와 zoom 상태를 useState로 관리
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(15); // 초기 줌 레벨을 적당히 설정

    useEffect(() => {
        // 첫 번째 장소가 있으면 지도 중앙과 줌을 첫 번째 장소로 설정
        if (selectedPlaces[0]?.[0]) {
            setMapCenter({
                lat: selectedPlaces[0][0].location.lat,
                lng: selectedPlaces[0][0].location.lng,
            });
            setMapZoom(15); // 첫 장소에 맞는 줌 레벨로 설정 (필요에 따라 조정)
        }
    }, [selectedPlaces]);

    // 콘솔 로그로 데이터와 google 객체 상태 확인
    useEffect(() => {
        console.log("Selected Places:", selectedPlaces);
        console.log("Google Maps Symbol Path:", window.google?.maps?.SymbolPath);
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
                {selectedPlaces.map((dayPlaces, dayIndex) => (
                    dayPlaces.map((place, placeIndex) => (
                        <MarkerF
                            key={place.place_id}
                            position={{ lat: place.location.lat, lng: place.location.lng }}
                            label={{
                                text: `${placeIndex + 1}`,
                                color: "white",
                                fontSize: "12px",
                            }}
                            icon={{
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                fillColor: colors[dayIndex % colors.length],
                                fillOpacity: 1,
                                strokeWeight: 1,
                            }}
                        />
                    ))
                ))}
            </GoogleMap>
        </LoadScript>
    </MapContainer>
  );    

    // // 각 DAY별로 다른 색상 배열
    // const dayColors = ["red", "blue", "green", "purple", "orange", "pink"];    

    // return (
    //     <MapContainer>
    //         <LoadScript googleMapsApiKey={apiKey}> {/* Redux에서 가져온 API 키 사용 */}
    //             <GoogleMap
    //                 mapContainerStyle={containerStyle}
    //                 center={seoulCenter}
    //                 zoom={13} // 서울에 맞는 적당한 줌 레벨
    //             >
    //                 {selectedPlaces.map((dayPlaces, dayIndex) => {
    //                     dayPlaces.map((place, placeIndex) => (
    //                         <Marker 
    //                             key={place.place_id}
    //                             position={{
    //                                 lat: place.location.lat,
    //                                 lng: place.location.lng,
    //                             }}
    //                             label={{
    //                                 text: `${placeIndex + 1}`, // 순번
    //                                 color: "white",
    //                                 fontSize: "12px",
    //                                 fontWeight:"bold",
    //                             }}
    //                             icon={{
    //                                 path: window.google.maps.SymbolPath.CIRCLE,
    //                                 fillColor: dayColors[dayIndex % dayColors.length], // dayIndex별로 다른 색상 적용
    //                                 fillOpacity: 1,
    //                                 strokeWeight: 1,
    //                                 scale: 8, 
    //                             }}
    //                         />
    //                     ))
    //                 })}
    //             </GoogleMap>
    //         </LoadScript>
    //     </MapContainer>
    // );
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