import { useEffect, useState } from "react"
import { BsArrowLeftCircle } from "react-icons/bs";
import { BsArrowRightCircle } from "react-icons/bs";
import styled from "styled-components";



const BestCardSlider = ({items}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    // 화면 크기에 따라 isMobile 값을 업데이트
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const handleNext = () => {
        // currentIndex가 아이템의 개수 - 5에 도달하면 0으로 돌아갑니다
        setCurrentIndex((prevIndex) => (prevIndex + (isMobile ? 1 : 5)) % items.length);
    };

    const handlePrev = () => {
        // currentIndex가 0보다 작아지면 마지막 5개로 돌아갑니다
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? items.length - (isMobile ? 1 : 5) : prevIndex - (isMobile ? 1: 5)
        );
    };

    return (

        <SliderWrapper>
            <ArrowButton onClick={handlePrev}>
                <BsArrowLeftCircle size={30} />
            </ArrowButton>
            <SliderContainer>
                <CardWrapper $currentIndex={currentIndex} $isMobile={isMobile}>
                    {items.map((item, index) => (
                        <Card key={index}>
                            <img src={item.imageUrl} alt={item.name} />
                            <CardLabel>{item.name}</CardLabel>
                        </Card>
                    ))}
                </CardWrapper>
            </SliderContainer>
            <ArrowButton onClick={handleNext}>
                    <BsArrowRightCircle size={30} />
                </ArrowButton>
        </SliderWrapper>
    )
}

export default BestCardSlider

const SliderWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    padding: 12px 20px;
`

const SliderContainer = styled.div`
    position: relative;
    overflow: hidden;
    width: calc(100% - 60px); /* 양쪽 화살표 공간을 제외한 너비 설정 */
`

const CardWrapper = styled.div`
    display: flex;
    /* gap: 16px;  카드 사이에 간격 추가 */
    margin: 8px;
    padding: 0 8px; /* 양쪽에 패딩을 추가하여 첫 번째와 마지막 카드가 잘리지 않도록 설정 */
    box-sizing: border-box;
    transition: transform 0.5s ease-in-out;
    transform: ${({ $currentIndex, $isMobile }) => 
        `translateX(-${$currentIndex * ($isMobile ? 100 : 100 / 5)}%)`
    }
`

const Card = styled.div`
    /* min-width: calc(100% / 5); 기본 화면에서 한 줄에 5개의 카드 */
    min-width: calc((100% - 70px) / 5); /* 5개의 카드와 4개의 간격을 고려한 너비 설정 */
    margin: 0 8px; /* 카드 사이에 간격을 추가 */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3); /* 기본 그림자 */

    img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
        margin: auto;
        transition: transform 0.3s ease; /* 부드러운 확대 전환 효과 */

        /* 호버 효과 추가 */
        &:hover {
            transform: scale(1.1);
        }
    }

    /* 모바일 화면에서 카드를 하나씩 보이도록 */
    @media (max-width: 768px) {
        min-width: 100%;  /* 화면 크기가 768px 이하일 때 카드 너비 100% */
    }
`

const CardLabel = styled.div`
    position: absolute;
    bottom: 8px;
    left: 8px;
    padding: 4px 8px;
    margin-top: 8px;
    font-size: 16px;
    font-weight: bold;
    color: white;
`

const ArrowButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: black;

    &:hover {
        color: #507dbc;
    }
`