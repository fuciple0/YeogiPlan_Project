import { useState } from "react";
import SearchBar from "./SearchBar";
import { FaStar, FaCheck, FaPlus } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import styled from "styled-components";

import beach1 from '../assets/home_img/beach1.jpg';
import beach2 from '../assets/home_img/beach2.jpg';
import beach3 from '../assets/home_img/beach3.jpg';
import beach4 from '../assets/home_img/beach4.jpg';

// 더미 데이터 정의
const searchResultDatas = [
    { name: '해운대 해수욕장', description: '부산의 대표 해수욕장으로 다양한 해양 활동을 즐길 수 있는 곳입니다.', rating: 4.8, imageUrl: beach1 },
    { name: '광안리 해수욕장', description: '광안대교의 야경이 아름다운 해변입니다.', rating: 4.4, imageUrl: beach2 },
    { name: '송정 해수욕장', description: '조용한 분위기의 해변으로, 서핑으로 유명합니다.', rating: 4.3, imageUrl: beach3 },
    { name: '을왕리 해수욕장', description: '인천의 깨끗하고 조용한 해변입니다.', rating: 4.5, imageUrl: beach4 },
  ];

  const SearchModal = ({ isOpen, onClose }) => {
    const [searchInput, setSearchInput] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [selectedItems, setSelectedItems] = useState([])  // 선택된 항목 저장
  
    const handleSearchChange = (event) => {
      const input = event.target.value
      setSearchInput(input)
  
      if (input) {
        const results = searchResultDatas.filter(place =>
            place.name.includes(input)
        );
        setSearchResults(results)
      } else {
        setSearchResults([])
      }
    }

    const toggleSelectItem = (item) => {
        setSelectedItems((prevSelectedItems) => {
            if(prevSelectedItems.includes(item)) {
                return prevSelectedItems.filter(i => i !== item)  // 선택 해제
            } else {
                return [...prevSelectedItems, item] // 선택 추가
            }
        })
    }

    // 모달이 닫힐 때 선택 항목 초기화
    const handleClose = () => {
        setSelectedItems([])  // 선택된 항목 초기화
        setSearchInput("")  // 검색어 초기화
        setSearchResults([]) // 검색 결과 초기화
        onClose()  // 부모 컴포넌트로부터 전달된 닫기 함수 호출
    }

    const handleAdd = () => {
        if(selectedItems.length == 0) {
            alert('추가할 장소를 선택해주세요!')
            return
        }
        // 추가 버튼 클릭 시 선택된 항목을 플래닝 페이지로 넘김
        // 일단 alert로 보여주기(임시)
        const selectedItemText = selectedItems
            .map(item => `이름: ${item.name}\n설명: ${item.description}`)
            .join("\n\n")
        
        alert(`선택된 항목: \n\n${selectedItemText}`)
        onClose();
        handleClose()
        
    }

    if(!isOpen) return null  // isOpen이 false면 모달을 렌더링하지 않음

    return (
        <Overlay onClick={handleClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <SearchBar value={searchInput} onChange={handleSearchChange} placeholder="장소를 검색해보세요" isReadOnly={false}/>

                <ResultsHeader>검색결과</ResultsHeader>
                <SearchResults>
                {searchResults.length > 0 ? (searchResults.map((result, index) => (
                    <SearchResultItem key={index}>
                        <img src={result.imageUrl} alt={result.name} />
                        <ResultInfo>
                            <ResultTitle>{result.name}</ResultTitle>
                            <ResultDescription>{result.description}</ResultDescription>
                            <ResultRating><FaStar color="#FFC978"/>{result.rating}</ResultRating>
                        </ResultInfo>
                        <AddIcon onClick={() => toggleSelectItem(result)}>
                            {selectedItems.includes(result) ? <FaCheck color="#507DBC" /> : <FaPlus size={20} color="#333" /> }
                        </AddIcon>
                    </SearchResultItem>
                ))
            ) : (
                <NoResults>
                    <IoIosWarning size={80} color="#A0A0A0"/>
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
    )
}

export default SearchModal

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
`

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
  overflow: hidden;  /* 내부 스크롤에 대비해 overflow를 hidden으로 설정 */
`

const SearchResults = styled.div`
    margin-top: 8px;
    flex-grow: 1; /* 검색결과 영역이 남은 공간을 채우도록 설정 */
    overflow-y: auto; /* 검색결과가 많으면 스크롤 활성화 */
`

const ResultsHeader = styled.h3`
    font-weight: bold;
    margin-bottom: 2px;
`

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
`

const ResultInfo = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 200px;
`

const ResultTitle = styled.div`
    font-weight: bold;
    font-size: 15px;
`

const ResultDescription = styled.div`
    color: #666;
    font-size: 12px;
    width: 92%;
`

const ResultRating = styled.div`
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: center;

    svg {
        margin-right: 4px;
    }
`

const AddIcon = styled.div`
    color: #007aff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: 16px;

`

const NoResults = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
`

const NoResultsText = styled.div`
    font-size: 16px;
    margin-top: 10px;
    color: #888;
`

const ModalFooter = styled.div`
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #ccc;
    padding-top: 10px;
    margin-top: 10px;
`

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
`

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