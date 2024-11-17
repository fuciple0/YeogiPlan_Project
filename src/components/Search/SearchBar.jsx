import React from "react"
import styled from "styled-components"
import { IoIosSearch } from "react-icons/io"; // 검색 아이콘 import

const SearchBar = ({ placeholder = "여기에서 시작해보세요", onChange, value, onClick, isReadOnly=false}) => (
    <SearchContainer onClick={onClick}>
      <IoIosSearch />
      <Input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        readOnly={isReadOnly}
      />
    </SearchContainer>
  );

export default SearchBar

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
`

const Input = styled.input`
  border: none;
  outline: none;
  background: none;
  margin-left: 8px;
  width: 100%;
  font-size: 16px;
  cursor: text;

  &:focus {
    cursor: text;
  }
`;