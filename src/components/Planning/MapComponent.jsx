//#구글 지도 라이브러리 설치
//yarn add @react-google-maps/api
//--------------------------------------------------------------------------------------------------------------------------------

import React from 'react';
import styled from 'styled-components';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useSelector } from 'react-redux'; // useSelector 임포트

const MapComponent = () => {
    // Redux에서 API 키를 불러옵니다
    const apiKey = useSelector(state => state.map.googleMapApiKey);  // 스토어에서 API 키 가져오기

    const containerStyle = {
        width: '100%',
        height: '800px', // 지도 높이는 적당히 설정
    };

    const seoulCenter = {
        lat: 37.5665, // 서울의 위도
        lng: 126.9780, // 서울의 경도
    };

    return (
        <MapContainer>
            <LoadScript googleMapsApiKey={apiKey}> {/* Redux에서 가져온 API 키 사용 */}
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={seoulCenter}
                    zoom={13} // 서울에 맞는 적당한 줌 레벨
                >
                    <Marker position={seoulCenter} />
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