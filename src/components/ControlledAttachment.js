import React, { useState } from 'react';
import { useController } from 'react-hook-form';
import { Box, Button, Typography, List, ListItem, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import storage from '../firebaseConfig'; // Instância do Firebase Storage
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ControlledAttachment = ({ name, control, label, rules = {} }) => {
  const { field, fieldState } = useController({ name, control, rules });
  const [files, setFiles] = useState([]); // Lista de arquivos locais
  const [uploadedUrls, setUploadedUrls] = useState([]); // URLs no Firebase Storage
  const [uploading, setUploading] = useState(false); // Estado de upload ativo/inativo

  // Gerencia a mudança ao selecionar arquivos
  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files); // Converte em uma array
    setFiles((prev) => [...prev, ...newFiles]); // Atualiza os arquivos locais

    setUploading(true); // Indica upload em progresso
    try {
      const urls = await Promise.all(
        newFiles.map(async (file) => {
          const storageRef = ref(storage, `exames/${file.name}`); // Referência no Storage
          await uploadBytes(storageRef, file); // Envia para o Firebase
          const url = await getDownloadURL(storageRef); // Obtém a URL do arquivo
          return url;
        })
      );

      setUploadedUrls((prev) => [...prev, ...urls]); // Atualiza as URLs no estado
      field.onChange([...uploadedUrls, ...urls]); // Sincroniza com o react-hook-form
      toast.success('Arquivos enviados com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar arquivos: ' + error.message);
    } finally {
      setUploading(false); // Finaliza o estado de upload
    }
  };

  // Remove um arquivo selecionado
  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index); // Remove do estado local
    const updatedUrls = uploadedUrls.filter((_, i) => i !== index); // Remove URLs correspondentes
    setFiles(updatedFiles);
    setUploadedUrls(updatedUrls);
    field.onChange(updatedUrls); // Atualiza o react-hook-form
  };

  return (
    <Box>
      <Typography variant="subtitle1">{label}</Typography>

      {/* Botão de upload */}
      <Button variant="contained" component="label" disabled={uploading}>
        {uploading ? <CircularProgress size={24} /> : 'Upload Arquivos'}
        <input
          type="file"
          hidden
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
      </Button>

      {/* Lista de arquivos */}
      <List>
        {files.map((file, index) => (
          <ListItem key={index}>
            <Typography variant="body2">{file.name}</Typography>
            <IconButton onClick={() => handleRemoveFile(index)} aria-label="Remover arquivo">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Exibição de erros */}
      {fieldState.error && (
        <Typography variant="body2" color="error">
          {fieldState.error.message}
        </Typography>
      )}
    </Box>
  );
};

export default ControlledAttachment;
