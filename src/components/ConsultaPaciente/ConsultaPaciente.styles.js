import styled from 'styled-components';

export const ConsultaContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const ConsultaTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

export const ConsultaForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const ConsultaLabel = styled.label`
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  margin-bottom: 10px;
`;

export const ConsultaInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
`;

export const ConsultaButton = styled.button`
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
