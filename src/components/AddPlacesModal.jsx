import React, { useState } from "react";
import styled from "styled-components";
import { FaStar, FaCheck, FaPlus } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import Skeleton from "./Skeleton";

const AddPlacesModal = ({ isOpen, onClose, onConfirm }) => {
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchInput) return;

        setIsLoading(true);

        const url = `http://43.201.36.203:3001/googleApi/keywordSearch?searchTerm=${searchInput}`;

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
        onClose();
    };

    const handleConfirm = () => {
        if (selectedItems.length === 0) {
            alert("추가할 장소를 선택해주세요!");
            return;
        }
        onConfirm(selectedItems);
        handleClose();
    };

    if (!isOpen) return null;

    return (
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

                <ResultsHeader>검색 결과</ResultsHeader>
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
                                        <FaStar color="#ffb535" size={16}/> {/* 별 아이콘 */}
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
                            <NoResultsText>검색 결과가 없습니다</NoResultsText>
                        </NoResults>
                    )}
                </SearchResults>

                <ModalFooter>
                    <CancelButton onClick={handleClose}>취소</CancelButton>
                    <AddButton onClick={handleConfirm}>추가</AddButton>
                </ModalFooter>
            </ModalContent>
        </Overlay>
    );
};

export default AddPlacesModal;

// 스타일 컴포넌트
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

// 나머지 스타일 컴포넌트는 SearchModal에서 가져와 그대로 사용합니다
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