import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, child } from 'firebase/database';
import { LoginContainer, LoginForm, LoginTitle, LoginLabel, LoginInput, LoginButton } from './Login.styles';
import database from '../../firebaseConfig'; // Importe a configuração do Firebase

const Login = () => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifica a credencial fixa do Administrador Master
    if (username === 'master' && senha === '123') {
      navigate('/menu');
      return;
    }

    try {
      // Verifica as credenciais dos usuários no banco de dados
      const userRef = ref(database, 'usuarios');
      const snapshot = await get(child(userRef, username));

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === senha) {
          navigate('/menu');
        } else {
          alert('Nome de usuário ou senha incorretos');
        }
      } else {
        alert('Nome de usuário ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro ao verificar credenciais:', error);
      alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <LoginTitle>Login</LoginTitle>
        <LoginLabel>
          Nome de Usuário:
          <LoginInput type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
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