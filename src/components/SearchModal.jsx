import { useState } from "react";
import SearchBar from "./SearchBar";
import { FaStar } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import styled from "styled-components";

import beach1 from '../assets/home_img/beach1.jpg';
import beach2 from '../assets/home_img/beach2.jpg';
import beach3 from '../assets/home_img/beach3.jpg';
import beach4 from '../assets/home_img/beach4.jpg';

// 더미 데이터 정의
const searchResultDatas = [
    { name: '해운대 해수욕장', description: '부산의 대표 해수욕장으로 다양한 해양 활동을 즐길 수 있는 곳입니다.아너린아러ㅣㅇ나ㅓ린아ㅓㅇ나리ㅓㄴ', rating: 4.8, imageUrl: beach1 },
    { name: '광안리 해수욕장', description: '광안대교의 야경이 아름다운 해변입니다.', rating: 4.4, imageUrl: beach2 },
    { name: '송정 해수욕장', description: '조용한 분위기의 해변으로, 서핑으로 유명합니다.', rating: 4.3, imageUrl: beach3 },
    { name: '을왕리 해수욕장', description: '인천의 깨끗하고 조용한 해변입니다.', rating: 4.5, imageUrl: beach4 },
  ];

  const SearchModal = ({ isOpen, onClose }) => {
    const [searchInput, setSearchInput] = useState("")
    const [searchResults, setSearchResults] = useState([])
  
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

    if(!isOpen) return null  // isOpen이 false면 모달을 렌더링하지 않음

    return (
        <Overlay onClick={onClose}>
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
                        <AddIcon>
                            <CiSquarePlus size={20} />
                        </AddIcon>
                    </SearchResultItem>
                ))
            ) : (
                <NoResults>검색결과가 없습니다</NoResults>
            )}
            </SearchResults>

            <ModalFooter>
                <CancelButton onClick={onClose}>취소</CancelButton>
                <AddButton>추가</AddButton>
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
    margin-top: 16px;
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
`

const NoResults = styled.div`
    padding: 20px;
    color: #888;
    text-align: center;
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
    color: #007aff;
    background: none;
    border: none;
    font-weight: bold;
    cursor: pointer;
`