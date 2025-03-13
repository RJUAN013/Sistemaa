import styled from 'styled-components';

export const PainelContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

export const PainelTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

export const PainelCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.lightBackground};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

export const PainelSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: flex-start;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  margin-bottom: 20px;
`;

export const PainelForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const PainelButton = styled.button`
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