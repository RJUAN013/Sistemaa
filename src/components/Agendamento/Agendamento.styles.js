import styled from 'styled-components';

export const AgendamentoContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const AgendamentoTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

export const AgendamentoForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const AgendamentoLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 5px;
`;

export const AgendamentoInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
`;

export const AgendamentoButton = styled.button`
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
