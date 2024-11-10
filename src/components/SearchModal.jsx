import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar, FaCheck, FaPlus } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import styled from "styled-components";
import Skeleton from "./Skeleton";
import DateSelectModal from "./DateSelectModal";
import { addTripData } from "../store/placeSlice"; // Redux 액션 추가

const SearchModal = ({ isOpen, onClose }) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDateSelectOpen, setIsDateSelectOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!searchInput) return;

        setIsLoading(true);

        // 임의의 데이터 설정
        const mockData = [
            {
                place_id: "1",
                place_name: "테스트 장소 1",
                place_img: "https://via.placeholder.com/60",
                place_location_x: 37.5665,
                place_location_y: 126.9780,
            },
            {
                place_id: "2",
                place_name: "테스트 장소 2",
                place_img: "https://via.placeholder.com/60",
                place_location_x: 37.5765,
                place_location_y: 126.9880,
            },
            {
                place_id: "3",
                place_name: "테스트 장소 3",
                place_img: "https://via.placeholder.com/60",
                place_location_x: 37.5865,
                place_location_y: 126.9980,
            },
        ];

        setTimeout(() => {
            setSearchResults(mockData);
            setIsLoading(false);
        }, 500); 
    };

    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const toggleSelectItem = (item) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(item)) {
                return prevSelectedItems.filter((i) => i !== item);
            } else {
                return [...prevSelectedItems, item];
            }
        });
    };

    const handleClose = () => {
        setSelectedItems([]);
        setSearchInput("");
        setSearchResults([]);
        onClose();
    };

    const handleAdd = () => {
        if (selectedItems.length === 0) {
            alert("추가할 장소를 선택해주세요!");
            return;
        }
        setIsDateSelectOpen(true); // DateSelectModal 열기
    };

    const handleDateSelectClose = () => {
        setIsDateSelectOpen(false);
    };

    // DateSelectModal에서 날짜를 선택한 후 실행되는 함수
    const handleDateSelectConfirm = async (tripData) => {
        console.log("Redux에 저장할 tripData:", tripData);
        console.log("Redux에 저장할 selectedPlaces:", selectedItems);

        // 1. Redux 상태 업데이트
        dispatch(addTripData({
            tripData: {
                tripTitle: tripData.tripTitle,
                destination: tripData.destination,
                startDate: tripData.startDate,
                endDate: tripData.endDate,
            },
            places: selectedItems,
        }));

        // 2. 데이터베이스에 저장
        try {
            const response = await fetch('http://15.164.142.129:3001/api/trip_plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 1, // 로그인 구현 전, 임시 ID로 설정
                    trip_plan_title: tripData.tripTitle,
                    start_date: tripData.startDate,
                    end_date: tripData.endDate,
                    destination: tripData.destination,
                    route_shared: "public",
                }),
            });

            const result = await response.json();
            if (response.ok && result.success) {
                console.log("여행 데이터 저장 성공:", result.data);

                // tripData에 trip_plan_id 추가
                const tripDataWithId = { ...tripData, trip_plan_id: result.data.trip_plan_id };
                console.log("Redux에 저장할 tripDataWithId:", tripDataWithId); // 확인용 로그

                // Redux 상태 업데이트
                dispatch(addTripData({
                    tripData: tripDataWithId,
                    places: selectedItems,
                }));

                navigate("/planning"); // 저장 성공 시 Planning 페이지로 이동
            } else {
                console.error("여행 데이터 저장 실패:", result.message);
            }
        } catch (error) {
            console.error("API 요청 오류:", error);
        }

        setIsDateSelectOpen(false);
        handleClose(); // SearchModal 닫기
    };

    if (!isOpen) return null;

    return (
        <>
            {/* SearchModal */}
            <Overlay onClick={handleClose}>
                <ModalContent onClick={(e) => e.stopPropagation()}>
                    <SearchContainer>
                        <SearchInput 
                            value={searchInput} 
                            onChange={handleInputChange}
                            placeholder="장소를 검색해보세요" 
                        />
                        <SearchButton onClick={handleSearch}>검색</SearchButton> 
                    </SearchContainer>

                    <ResultsHeader>검색결과</ResultsHeader>
                    <SearchResults>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <SkeletonResultItem key={index}>
                                    <Skeleton width="60px" height="60px" />
                                    <ResultInfo>
                                        <Skeleton width="80%" height="16px" />
                                        <Skeleton width="60%" height="14px" />
                                        <Skeleton width="40%" height="14px" />
                                    </ResultInfo>
                                </SkeletonResultItem>
                            ))
                        ) : searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <SearchResultItem key={result.place_id}>
                                    <img src={result.place_img} alt={result.place_name} />
                                    <ResultInfo>
                                        <ResultTitle>{result.place_name}</ResultTitle>
                                        <ResultDescription>위도: {result.place_location_x}, 경도: {result.place_location_y}</ResultDescription>
                                    </ResultInfo>
                                    <AddIcon onClick={() => toggleSelectItem(result)}>
                                        {selectedItems.includes(result) ? (
                                            <FaCheck color="#507DBC" />
                                        ) : (
                                            <FaPlus size={20} color="#333" />
                                        )}
                                    </AddIcon>
                                </SearchResultItem>
                            ))
                        ) : (
                            <NoResults>
                                <IoIosWarning size={80} color="#A0A0A0" />
                                <NoResultsText>검색결과가 없습니다</NoResultsText>
                            </NoResults>
                        )}
                    </SearchResults>

                    <ModalFooter>
                        <CancelButton onClick={handleClose}>취소</CancelButton>
                        <AddButton onClick={handleAdd}>추가</AddButton>
                    </ModalFooter>
                </ModalContent>
            </Overlay>

            {/* DateSelectModal에 선택된 장소 전달 */}
            {isDateSelectOpen && (
                <DateSelectModal
                    open={isDateSelectOpen}
                    onClose={handleDateSelectClose}
                    onConfirm={handleDateSelectConfirm} // Date 선택 후 Confirm 핸들러
                    selectedPlaces={selectedItems}
                />
            )}
        </>
    );
};

export default SearchModal;

// 스타일 코드 그대로 유지
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    width: 90%;
    max-width: 560px;
    height: 460px;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
`;

const SearchContainer = styled.div`
    display: flex;
    margin-bottom: 8px;
`;

const SearchInput = styled.input`
    flex: 1;
    padding: 12px;
    font-size: 14px;
    border: none;
    border-radius: 4px 0 0 4px;
    background-color: #f1f1f1;
    outline: none;
`;

const SearchButton = styled.button`
    padding: 8px 16px;
    font-size: 14px;
    color: white;
    background-color: #507dbc;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;

    &:hover {
        background-color: #3f5f8a;
    }
`;

const ResultsHeader = styled.h3`
    font-weight: bold;
    margin-bottom: 2px;
`;

const SearchResults = styled.div`
    margin-top: 8px;
    flex-grow: 1;
    overflow-y: auto;
`;

const SearchResultItem = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    height: 100px;

    &:hover {
        background-color: #f0f0f0;
    }

    img {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        margin-right: 8px;
    }
`;

const SkeletonResultItem = styled(SearchResultItem)`
    cursor: default;
    div:first-child {
        margin-right: 8px;
    }
`;

const ResultInfo = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const ResultTitle = styled.div`
    font-weight: bold;
    font-size: 15px;
`;

const ResultDescription = styled.div`
    color: #666;
    font-size: 12px;
    width: 92%;
`;

const AddIcon = styled.div`
    color: #007aff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: 16px;
`;

const NoResults = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
`;

const NoResultsText = styled.div`
    font-size: 16px;
    margin-top: 10px;
    color: #888;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #ccc;
    padding-top: 10px;
    margin-top: 10px;
`;

const CancelButton = styled.button`
    width: 50%;
    padding: 4px 0;
    font-size: 16px;
    color: #333;
    background: none;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-right: 1px solid #ccc;
`;

const AddButton = styled.button`
    width: 50%;
    padding: 4px 0;
    font-size: 16px;
    color: #507DBC;
    background: none;
    border: none;
    font-weight: bold;
    cursor: pointer;
`
