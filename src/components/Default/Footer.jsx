import React from 'react';
import styled from 'styled-components';
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { FiFigma } from 'react-icons/fi';

const FooterContainer = styled.footer`
  //background-color: #f8f9fa;
  background-color: white;
  color: #343a40;
  padding: 40px 20px;
  text-align: left;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-evenly;
  max-width: 1200px; /* 중앙 정렬을 위한 최대 너비 */
  width: 100%;
  gap: 50px; /* 섹션 사이 간격 */
`;

const SocialSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 15px;
  font-size: 24px;
  color: #343a40;
`;

const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: #343a40;
`;

const ListItem = styled.p`
  margin: 0;
  font-size: 14px;
  color: #495057;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        {/* 소셜 아이콘 섹션 */}
        <SocialSection>
          <FiFigma size={32} />
          <IconContainer>
            <FaTwitter />
            <FaInstagram />
            <FaYoutube />
            <FaLinkedin />
          </IconContainer>
        </SocialSection>

        {/* Use cases 섹션 */}
        <ListSection>
          <SectionTitle>Use cases</SectionTitle>
          <ListItem>UI design</ListItem>
          <ListItem>UX design</ListItem>
          <ListItem>Wireframing</ListItem>
          <ListItem>Diagramming</ListItem>
          <ListItem>Brainstorming</ListItem>
          <ListItem>Online whiteboard</ListItem>
          <ListItem>Team collaboration</ListItem>
        </ListSection>

        {/* Explore 섹션 */}
        <ListSection>
          <SectionTitle>Explore</SectionTitle>
          <ListItem>Design</ListItem>
          <ListItem>Prototyping</ListItem>
          <ListItem>Development features</ListItem>
          <ListItem>Design systems</ListItem>
          <ListItem>Collaboration features</ListItem>
          <ListItem>Design process</ListItem>
          <ListItem>FigJam</ListItem>
        </ListSection>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
