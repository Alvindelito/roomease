import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import NavItem from './NavItem';
import HomeIcon from '../../assets/HomeIcon';
import ExpensesIcon from '../../assets/ExpensesIcon';
import ChoresIcon from '../../assets/ChoresIcon';
import GroceriesIcon from '../../assets/GroceriesIcon';

const NavBar = () => {
  return (
    <NavStyles>
      <NavItem title="Home">
        <HomeIcon />
      </NavItem>
      <NavItem title="Expenses">
        <ExpensesIcon />
      </NavItem>
      <NavItem title="Chores">
        <ChoresIcon />
      </NavItem>
      <NavItem title="Groceries">
        <GroceriesIcon />
      </NavItem>
    </NavStyles>
  );
};

const NavStyles = styled.nav`
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 0;
  height: 10%;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  border-top: ${({ theme }) => `1px solid ${theme.neutral.grey200}`};
`;

export default NavBar;
