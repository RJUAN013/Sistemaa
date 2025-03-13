import styled from 'styled-components';

export const AtendimentosContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

export const AtendimentoItem = styled.div`
  background-color: ${({ theme }) => theme.colors.lightBackground};
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

export const AtendimentoButton = styled.button`
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
