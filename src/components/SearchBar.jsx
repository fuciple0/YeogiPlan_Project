import React from "react"
import styled from "styled-components"
import { IoIosSearch } from "react-icons/io"; // 검색 아이콘 import

const SearchBar = () => {
    return (
        <SearchBoxContainer>
            <SearchInput type="search" placeholder="여기서 시작해보세요!"/>
            <SearchButton>
                <SearchIcon />
            </SearchButton>
        </SearchBoxContainer>
    )
}

export default SearchBar

const SearchBoxContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    border: 1px solid #F5F6F7;
    border-radius: 20px;
    background-color: #F5F6F7;
    padding: 12px 24px;
`

const SearchInput = styled.input`
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;
`

const SearchButton = styled.button`
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
`

const SearchIcon = styled(IoIosSearch)`
    width: 20px;
    height: 20px;
    color: #979797;
`