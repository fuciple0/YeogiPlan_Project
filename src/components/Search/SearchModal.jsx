import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar, FaCheck, FaPlus } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import styled from "styled-components";
import Skeleton from "../Effect/Skeleton";
import DateSelectModal from "../Planning/DateSelectModal";
import { addTripData } from "../../store/placeSlice"; // Redux 액션 추가

const SearchModal = ({ isOpen, onClose }) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDateSelectOpen, setIsDateSelectOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userId = useSelector((state) => state.user.userInfo.userId);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // 로그인 상태 확인

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    const handleSearch = async () => {
        if (!searchInput) return;

        setIsLoading(true);

        const url = `http://3.36.99.105:3001/googleApi/keywordSearch?searchTerm=${searchInput}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) throw new Error("API 요청 실패");

            setSearchResults(data.places);
            console.log(data)
        } catch (error) {
            console.log("검색 오류: ", error);
        } finally {
            setIsLoading(false);
        }
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
        setIsDateSelectOpen(false)
        onClose();
    };

    const handleAdd = () => {
        if (selectedItems.length === 0) {
            alert("추가할 장소를 선택해주세요!");
            return;
        }

        if (!isLoggedIn) {
            alert('로그인이 필요합니다.')
            navigate('/login')
        } else {
            setIsDateSelectOpen(true); // DateSelectModal 열기
        }
    };

    const handleDateSelectClose = () => {
        setIsDateSelectOpen(false);
    };

    // DateSelectModal에서 날짜를 선택한 후 실행되는 함수
    const handleDateSelectConfirm = async (tripDataWithId) => {
        console.log("Redux에 저장할 tripData:", tripDataWithId);
        console.log("Redux에 저장할 selectedPlaces:", selectedItems);

        // 1. Redux 상태 업데이트
        dispatch(addTripData({
            tripData: tripDataWithId,
            places: selectedItems,
        }));

        // 2. 각 장소를 tirp_plan_id와 함께 데이터베이스에 저장
        const tripPlanId = tripDataWithId.trip_plan_id

        // 3. 데이터베이스에 저장
        try {
            await Promise.all(
                selectedItems.map(async (place, index) => {
                    const response = await fetch(`http://15.164.142.129:3001/api/trip_plan/${tripPlanId}/detail`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_id: userId, // 실제 user_id로 변경 필요
                            trip_day: 1, // 기본값 또는 실제 여행 일정에 따라 설정
                            place_name: place.name,
                            place_name_x: place.location.lat,
                            place_name_y: place.location.lng,
                            place_id: place.place_id,
                            memo: null,
                            memo_type: "love",
                            order_no: index + 1,
                            review_id: null,
                        }),
                    });

                    if (response.ok) {
                        console.log("장소 저장 성공:", place.name);
                    } else {
                        console.error("장소 저장 실패:", response.statusText);
                    }
                })
            );

            console.log("모든 장소가 성공적으로 추가되었습니다.");
            navigate("/planning"); // 저장 성공 시 Planning 페이지로 이동
        } catch (error) {
            console.error("장소 추가 중 오류 발생:", error);
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
                            onKeyPress={handleKeyPress}
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
                                    <img src={result.photo} alt={result.name} />
                                    <ResultInfo>
                                        <ResultTitle>{result.name}</ResultTitle>
                                        <ResultDescription>
                                            <FaStar color="#ffb535" size={16} /> {/* 별 아이콘 */}
                                            <span>{result.rating ? result.rating.toFixed(1) : "없음"}</span> {/* 별점 수 표시 */}
                                        </ResultDescription>
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
    color: #333;
    font-size: 12px;
    width: 92%;
    display: flex;
    align-items: center; /* 아이콘과 텍스트를 수평 중앙 정렬 */
    gap: 4px; /* 아이콘과 텍스트 사이 간격 */
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

