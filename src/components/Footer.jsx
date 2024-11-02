import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.footerBackgroundColor || '#333'};
  color: ${({ theme }) => theme.footerTextColor || 'white'};
  padding: 20px 0;
  text-align: center;
  position: fixed;
  width: 100%;
  bottom: 0;
`;

const FooterContent = styled.div`
  margin: 5px 0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        <p>Contact: info@yourcompany.com</p>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
