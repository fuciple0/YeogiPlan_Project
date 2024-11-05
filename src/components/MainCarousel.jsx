import React, { useEffect, useState } from "react"
import styled from "styled-components"

const MainCarousel = (images) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    // 슬라이드 변경
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    const prevIndex = () => {
        setCurrentIndex((prevIndex) => {
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        })
    }

    // 자동 슬라이드 설정
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000)  // 5초마다 자동 슬라이드
        return (
            () => clearInterval(interval)  // component 언마운트 시 interval 제거
        )
    }, [])

    return (
        <SliderContainer>
            <SlideWrapper currentIndex={currentIndex}>
                {imageUrl.map((image, index) => {
                    <Slide key={index}>
                        <img src={image.imageUrl} alt={image.name} />
                    </Slide>
                })}
            </SlideWrapper>
            <Dots>
                {images.map((_, index) => {
                    <Dot key={index} active={index === currentIndex} onclick={() => setCurrentIndex(index)} />
                })}
            </Dots>
        </SliderContainer>
    )
}

export default MainCarousel

const SliderContainer = styled.div`
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: 20px;
`

const SlideWrapper = styled.div`
    display: flex;
    transition: transform 0.5s ease-in-out;
    transform: ${({ currentIndex }) => `translateX(-${currentIndex * 100}%)`};
    width: 100%;
`

const Slide = styled.div`
    min-width: 100%;
    box-sizing: border-box;

    img {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }
`

const Dots = styled.div`
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 10px;
    width: 100%;
`

const Dot = styled.div`
    width: 10px;
    height: 10px;
    margin: 0 5px;
    border-radius: 50%;
    background-color: ${(props) => (props.active ? '#507DBC' : '#c4c4c4')};
    cursor: pointer;
    transition: background-color 0.3s;
`