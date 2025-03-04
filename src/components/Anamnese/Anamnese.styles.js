import styled from 'styled-components';

export const AnamneseContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const AnamneseTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

export const AnamneseForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const AnamneseLabel = styled.label`
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  margin-bottom: 10px;
`;

export const AnamneseInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
`;

export const AnamnesePatientDetails = styled.div`
  background-color: ${({ theme }) => theme.colors.lightBackground};
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  p {
    color: ${({ theme }) => theme.colors.green};
    font-weight: bold;
    margin: 5px 0;
  }
`;

export const AnamneseTextarea = styled.textarea`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
`;

export const AnamneseButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;
