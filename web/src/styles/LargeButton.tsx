import styled from 'styled-components';

type ButtonProps = {
  textColor: string;
  backgroundColor: string;
};

const LargeButtonStyle = styled.button<ButtonProps>`
  width: 335px;
  height: 52px;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
`;

export default LargeButtonStyle;
