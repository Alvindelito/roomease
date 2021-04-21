import { FC, ReactNode } from 'react';
import styled from 'styled-components';

type childrenProps = {
  title: string;
  children?: ReactNode;
};

const HeaderStyle = styled.div`
  background-color: ${({ theme }) => theme.primary.dark};
  color: ${({ theme }) => theme.neutral.grey00};
  margin: 0;
  padding: 0;
  height: 10vh;
  width: 100vw;
  display: flex;
  justify-content: center;

  h2 {
    font-size: 1.5rem;
    font-weight: 500;
    align-self: flex-end;
    padding-bottom: 4px;
  }
`;

const Header: FC<childrenProps> = ({ title, children }) => {
  return (
    <HeaderStyle>
      <h2>{title}</h2>
      {children}
    </HeaderStyle>
  );
};

export default Header;
