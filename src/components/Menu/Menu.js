import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuContainer, MenuTitle, ItemContainer, ImageWrapper, Card } from './Menu.styles';
import PacienteImage from '../../image/paciente.png';
import AgendaImage from '../../image/agenda.png';
import AnamneseImage from '../../image/anamnese.png';
import ConsultaImage from '../../image/consulta.png';

const Menu = () => {
  const navigate = useNavigate();

  return (
    <MenuContainer>
      <MenuTitle>Menu</MenuTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
        <ItemContainer>
          <Card onClick={() => navigate('/cadastro-paciente')}>
            <ImageWrapper>
              <img src={PacienteImage} alt="Cadastro Paciente" width="150" height="150" />
            </ImageWrapper>
            <div>Cadastro Paciente</div>
          </Card>
        </ItemContainer>
        <ItemContainer>
          <Card onClick={() => navigate('/anamnese')}>
            <ImageWrapper>
              <img src={AnamneseImage} alt="Anamnese" width="150" height="150" />
            </ImageWrapper>
            <div>Anamnese</div>
          </Card>
        </ItemContainer>
        <ItemContainer>
          <Card onClick={() => navigate('/consulta-paciente')}>
            <ImageWrapper>
              <img src={ConsultaImage} alt="Consulta de Paciente" width="150" height="150" />
            </ImageWrapper>
            <div>Consulta de Paciente</div>
          </Card>
        </ItemContainer>
        <ItemContainer>
          <Card onClick={() => navigate('/agendamento')}>
            <ImageWrapper>
              <img src={AgendaImage} alt="Agendamento" width="150" height="150" />
            </ImageWrapper>
            <div>Agendamento</div>
          </Card>
        </ItemContainer>
        <ItemContainer> {/* Novo item para Cadastro de Usuário */}
          <Card onClick={() => navigate('/cadastro-usuario')}>
            <ImageWrapper>
              <img src={AgendaImage} alt="Cadastro Usuário" width="150" height="150" />
            </ImageWrapper>
            <div>Cadastro Usuário</div>
          </Card>
        </ItemContainer>
        <ItemContainer> {/* Novo item para Cadastro de Usuário */}
          <Card onClick={() => navigate('/painel-controle')}>
            <ImageWrapper>
              <img src={AgendaImage} alt="Painel de Controle" width="150" height="150" />
            </ImageWrapper>
            <div>Painel de Controle</div>
          </Card>
        </ItemContainer>
      </div>
    </MenuContainer>
  );
};

export default Menu;