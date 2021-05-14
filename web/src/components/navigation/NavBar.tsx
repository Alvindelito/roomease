import React from 'react';
import styled from 'styled-components';
import { useHistory, Link } from 'react-router-dom';
import NavItem from './NavItem';
import HomeIcon from '../../assets/HomeIcon';
import ExpensesIcon from '../../assets/ExpensesIcon';
import ChoresIcon from '../../assets/ChoresIcon';
import GroceriesIcon from '../../assets/GroceriesIcon';

const NavBar = () => {
  return (
    <NavStyles>
      <Link to="/">
        <NavItem title="Home">
          <HomeIcon />
        </NavItem>
      </Link>
      <Link to="/expenses">
        <NavItem title="Expenses">
          <ExpensesIcon />
        </NavItem>
      </Link>
      <Link to="/chores">
        <NavItem title="Chores">
          <ChoresIcon />
        </NavItem>
      </Link>
      <Link to="/groceries">
        <NavItem title="Groceries">
          <GroceriesIcon />
        </NavItem>
      </Link>
    </NavStyles>
  );
};

const NavStyles = styled.nav`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 10%;
  width: 100%;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  border-top: ${({ theme }) => `1px solid ${theme.neutral.grey200}`};

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.neutral.grey800};
    padding: 0.5rem;
  }
`;

export default NavBar;
