import styled from 'styled-components';

export const AnamneseContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

export const AnamneseTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

export const AnamneseSection = styled.div`
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.colors.lightBackground};
  padding: 20px;
  border-radius: 10px;
`;

export const AnamneseButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

export const SearchSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

export const SearchButton = styled.button`
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

export const PrintContainer = styled.div`
  @media print {
    size: A4;
    margin: 0;
    padding: 0;
    background-color: white;
    color: black;
    -webkit-print-color-adjust: exact;
  }
`;
