import React, { ReactNode } from 'react';
import styled from 'styled-components';

type NavType = {
  title: String;
  children?: ReactNode;
};

const NavItem = ({ title, children }: NavType) => {
  return (
    <NavItemStyles>
      {children}
      <h5>{title}</h5>
    </NavItemStyles>
  );
};

const NavItemStyles = styled.div`
  width: 20%;
  padding: 1.25%;
  display: flex;
  flex-direction: column;
  align-items: center;

  h5 {
    font-weight: 400;
    margin-top: 3px;
  }
`;

export default NavItem;
