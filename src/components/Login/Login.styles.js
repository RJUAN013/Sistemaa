import styled from 'styled-components';

// Estilos para a tela de login
export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary}, ${({ theme }) => theme.colors.primary});
`;

export const LoginForm = styled.form`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 300px;
  text-align: center;
`;

export const LoginTitle = styled.h2`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

export const LoginLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const LoginInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
  box-sizing: border-box;
`;

export const LoginButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  color: ${({ theme }) => theme.colors.white};
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;
