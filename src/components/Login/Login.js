import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContainer, LoginForm, LoginTitle, LoginLabel, LoginInput, LoginButton } from './Login.styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === 'teste@teste.com' && senha === '123') {
      navigate('/menu');
    } else {
      alert('E-mail ou senha incorretos');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Login</LoginTitle>
        <LoginLabel>
          E-mail:
          <LoginInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </LoginLabel>
        <LoginLabel>
          Senha:
          <LoginInput type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </LoginLabel>
        <LoginButton type="submit">Entrar</LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
