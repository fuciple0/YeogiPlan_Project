import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar, FaCheck, FaPlus } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import styled from "styled-components";
import Skeleton from "./Skeleton";
import { setTripPlan } from "../store/tripPlanSlice";

const SearchModal = ({ isOpen, onClose }) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux에서 로그인 상태, 사용자 ID, 토큰 및 trip plan 데이터 가져오기
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    // const userId = useSelector((state) => state.user.userInfo.userId);
    const userId = 3
    const token = useSelector((state) => state.user.token);
    const tripPlan = useSelector((state) => state.tripPlan.planData);

    const handleSearch = async () => {
        if (!searchInput) return;

        setIsLoading(true);
        const url = `http://43.201.36.203:3001/googleApi/keywordSearch?searchTerm=${searchInput}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) throw new Error("API 요청 실패");

            setSearchResults(data.places);
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
        onClose();
    };

    const handleAdd = async () => {
        if (selectedItems.length === 0) {
            alert("추가할 장소를 선택해주세요!");
            return;
        }

        const tripPlanData = {
            user_id: userId,
            trip_plan_title: "여름 휴가",
            start_date: "2024-07-01",
            end_date: "2024-07-10",
            destination: "제주도",
            route_shared: "private",
        };

        try {
            const response = await fetch("http://192.168.50.34:3001/api/trip_plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(tripPlanData),
            });

            if (!response.ok) throw new Error("데이터 저장 실패");

            const data = await response.json();
            console.log("Redux에 저장된 tripPlan 데이터:", data);

            // tripPlanId를 2로 고정
            const tripPlanId = 1;

            // 장소를 각 장소에 대한 데이터 형식으로 POST 요청
            for (const item of selectedItems) {
                const detailData = {
                    user_id: userId,
                    trip_day: 1, // 예시로 Day 1로 설정, 필요 시 수정 가능
                    place_name: item.name,
                    review_id: item.review_id || 202,
                    place_name_x: item.location_x || 33.4586,
                    place_name_y: item.location_y || 126.942,
                    order_no: selectedItems.indexOf(item) + 1,
                    memo: "아름다운 일출을 볼 수 있는 곳", // 사용자 입력 메모로 수정 가능
                    memo_type: "love",
                    place_id: item.place_id || "default_id"
                };

                const detailResponse = await fetch(`http://192.168.50.34:3001/api/trip_plan/${tripPlanId}/detail`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(detailData),
                });

                if (!detailResponse.ok) throw new Error("장소 추가 실패");

                console.log("장소 추가 성공:", await detailResponse.json());
            }

            alert("모든 장소가 성공적으로 추가되었습니다!");
            handleClose();
            navigate("/planning");
        } catch (error) {
            console.error("저장 오류:", error);
            alert("장소 추가에 실패했습니다.");
        }
    };

    if (!isOpen) return null;

    return (
        <Overlay onClick={handleClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <SearchContainer>
                   <SearchInput 
                    value={searchInput} 
                    onChange={handleInputChange}
                    placeholder="장소를 검색해보세요" />
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
                        searchResults.map((result, index) => (
                            <SearchResultItem key={result.place_id || index}>
                                <img src={result.photo} alt={result.name} />
                                <ResultInfo>
                                    <ResultTitle>{result.name}</ResultTitle>
                                    <ResultDescription>{result.address}</ResultDescription>
                                    <ResultRating>
                                        <FaStar color="#FFC978" />
                                        {typeof result.rating === "number"
                                            ? result.rating.toFixed(1)
                                            : "평점없음"}
                                    </ResultRating>
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
    );
};

export default SearchModal;

// Styled Components
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

const SearchResults = styled.div`
    margin-top: 8px;
    flex-grow: 1;
    overflow-y: auto;
`;

const ResultsHeader = styled.h3`
    font-weight: bold;
    margin-bottom: 2px;
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

const ResultRating = styled.div`
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: center;

    svg {
        margin-right: 4px;
    }
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
`;
