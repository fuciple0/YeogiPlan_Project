import React, { useEffect, useState } from "react"
import styled from "styled-components"

const MainCarousel = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    // 5초마다 슬라이드 index를 증가시키는 useEffect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1)
        }, 6000)  // 6초

        return (
            () => clearInterval(interval) // component unmount 시 interval 제거
        )
    }, [images.length])

    return (
        <SliderContainer>
            <SlideWrapper $currentIndex={currentIndex} $imageCount={images.length}>
                {images.map((image, index) => (
                    <Slide key={index} >
                        <img src={image.imageUrl} alt={image.name} />
                        <ImageLabel>@{image.name}</ImageLabel>
                    </Slide>
                ))}
            </SlideWrapper>
        
            <Dots>
                {images.map((_, index) => (
                    <Dot key={index} $isActive={index === currentIndex} onClick={() => setCurrentIndex(index)} />
                ))}
            </Dots>
        </SliderContainer>
    )
}

export default MainCarousel

const SliderContainer = styled.div`
    width: 100%;
    height: 500px;
    aspect-ratio: 16 / 9;  /* 가로세로 비율 설정 */
    overflow: hidden;
    position: relative;
    margin-top: 20px;
    border-radius: 8px;

    /* 모바일화면 */
    @media (max-width: 768px) {
        max-width: 100%; /* 모바일화면에서는 최대 너비를 100%로 */
    }
`

const SlideWrapper = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: ${({ $currentIndex }) => `translateX(-${$currentIndex * 100}%)`};
  width: 100%;
  height: 100%;
`

const Slide = styled.div`
  min-width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* 텍스트 위치 조정을 위한 relative 설정 */

    img {
        width: 100%;
        height: 100%; /* 이미지의 높이를 부모 요소에 맞춤 */
        object-fit: cover; /*이미지가 영역에 맞춰 크가 조정  */
        border-radius: inherit;
        background-color: #f0f0f0;
        filter: brightness(0.7); 
    }
`
const ImageLabel = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 4px;
    pointer-events: none;
`

const Dots = styled.div`
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 10px;
    width: 100%;
`

const Dot = styled.div`
    width: 6px;
    height: 6px;
    margin: 0 5px;
    border-radius: 50%;
    background-color: ${(props) => (props.$isActive ? '#507DBC' : '#c4c4c4')};
    cursor: pointer;
    transition: background-color 0.3s;
`