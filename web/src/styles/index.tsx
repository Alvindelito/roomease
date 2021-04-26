import styled from 'styled-components';

// ---------BUTTONS---------
const LargeButtonStyle = styled.button`
  width: 80vw;
  height: 52px;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 1.25px;
`;

//  ---------FORMS---------

const FormStyle = styled.form`
  max-width: 100%;
`;

const RequiredInput = styled.span`
  color: ${({ theme }) => theme.negative.negative400};
  font-size: 1.2rem;
`;

const FloatingLabel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  position: relative;
  border: ${({ theme }) => `1px solid ${theme.neutral.grey400}`};
  margin: 8px 0;
  border-radius: 8px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.neutral.grey800};
  font-weight: normal;
  opacity: 0.75;
  order: 1;
  padding-left: 2px;
  pointer-events: none;
  text-shadow: none;
  transform-origin: left top;
  transform: scale(1) translate3d(0, 22px, 0);
  transition: 200ms ease all;
  letter-spacing: 1.25px;
`;

const Input = styled.input`
  border-radius: 0;
  display: flex;
  font-size: 100%;
  line-height: 25px;
  text-shadow: none;

  border: 0;
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.3); */
  color: #000;
  flex: 1 1 auto;
  order: 2;

  &:focus {
    outline: 0;
  }

  &:not(:focus) + ${Label} {
    opacity: 1;
    transform: scale(0.8) translate3d(0, 5px, 0);
  }

  &:focus + ${Label} {
    color: ${({ theme }) => theme.primary.primary600};
    opacity: 1;
    transform: scale(0.8) translate3d(0, 5px, 0);
  }
`;

export {
  FormStyle,
  RequiredInput,
  LargeButtonStyle,
  FloatingLabel,
  Label,
  Input,
};
