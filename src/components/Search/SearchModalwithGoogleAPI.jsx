import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { FaStar } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import styled from "styled-components";



const SearchModalgoogle = ({ isOpen, onClose }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [photoUrls, setPhotoUrls] = useState({});

  useEffect(() => {
    const delayedFetchPlaces = setTimeout(() => {
      const fetchPlaces = async () => {
        if (searchInput) {
          try {
            const data = await fetchPlacesFromServer(searchInput);
            const filteredPlaces = data.places.filter(place =>
              place.name.toLowerCase().includes(searchInput.toLowerCase())
            );
            setSearchResults(filteredPlaces);

            // Fetch photo URLs for each filtered result
            filteredPlaces.forEach(async (place) => {
              if (place.photos?.[0]?.photo_reference && !photoUrls[place.photos[0].photo_reference]) {
                const photoUrl = await getPlacePhotoUrl(place.photos[0].photo_reference);
                setPhotoUrls(prevState => ({
                  ...prevState,
                  [place.photos[0].photo_reference]: photoUrl, // photo_reference를 키로 사용
                }));
              }
            });
          } catch (error) {
            console.error("Error fetching places:", error);
            setSearchResults([]);
          }
        } else {
          setSearchResults([]);
        }
      };

      fetchPlaces();
    }, 1000);

    return () => {
      clearTimeout(delayedFetchPlaces);
    };
  }, [searchInput]);

  const fetchPlacesFromServer = async (query) => {
    const response = await fetch(
      `http://3.36.99.105:3001/googleApi/keywordSearch?searchTerm=${query}`
    );
    const data = await response.json();
    console.log('Fetched Data:', data);
    return data;
  };

  const getPlacePhotoUrl = async (photoReference) => {
    if (!photoReference) return null;

    try {
      const response = await fetch(
        `http://3.36.99.105:3001/googleApi/getPlacePhoto?photoreference=${photoReference}`
      );
      const blob = await response.blob();
      const photoUrl = URL.createObjectURL(blob);
      return photoUrl;
    } catch (error) {
      console.error('Error fetching photo URL:', error);
      return null;
    }
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <SearchBar
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="장소를 검색해보세요"
          isReadOnly={false}
        />
        <ResultsHeader>검색결과</ResultsHeader>
        <div>

        </div>
        <SearchResults>
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <SearchResultItem key={result.place_id}>
                <img
                  src={photoUrls[result.photos?.[0]?.photo_reference] || "/path/to/default/image.jpg"} // photo_reference로 URL을 가져옴
                  alt={result.name}
                />
                <ResultInfo>
                  <ResultTitle>{result.name}</ResultTitle>
                  <ResultDescription>{result.address}</ResultDescription>
                  <ResultRating>
                    <FaStar color="#FFC978" />
                    {result.rating}
                  </ResultRating>
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
  );
};

export default SearchModalgoogle;

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

const SearchResults = styled.div`
  margin-top: 16px;
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

const ResultInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 200px;
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
`;

const NoResults = styled.div`
  padding: 20px;
  color: #888;
  text-align: center;
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
  color: #007aff;
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
`;
