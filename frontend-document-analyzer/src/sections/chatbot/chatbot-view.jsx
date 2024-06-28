import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Box  from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import Logo from '../../components/logo';
import { bgGradient } from '../../theme/css';
import * as api from '../../services/service1';

const itemDescriptions = {
  DOC01: 'Maroc - Contrat de travail',
  DOC02: 'Maroc - Extrait de naissance',
  DOC03: 'Maroc - Certificat de travail',
  DOC04: 'Maroc - Radio pulmonaire',
  DOC05: 'Maroc - Dossier du personnel renseigné',
  DOC06: 'MAR - Accusé de réception du règlement interne',
  DOC07: 'Maroc - Copies diplômes légalisées',
  DOC08: 'Maroc - Copie de CIN légalisée',
  DOC09: 'Maroc - Copie de la carte CNSS',
  DOC10: 'Maroc - Photos d\'identité récentes',
  DOC11: 'Maroc - Copie d\'attestation de RIB',
  DOC12: 'Maroc - Fiche Anthropométrique',
  DOC13: 'Maroc - Copie de l\'acte de mariage',
  DOC14: 'Maroc - Curriculum Vitae',
  DOC15: 'Maroc - Procédure Confidentialité des infos',
  DOC16: 'Maroc - Autorisation & Décharge',
  DOC17: 'Maroc - Charte de bonne conduite',
  DOC20: 'Maroc - Justificatif de changement d\'adresse',
  DOC32: 'Maroc - Copie de CIN',
  DOC33: 'Maroc - Copie de l\'acte de divorce',
  DOC34: 'MyFlex - Certificat Médical',
  DOC35: 'MyFlex - Certificat de Résidence',
  DOC36: 'MyFlex - Dossier Médical /Pli confidentiel',
  DOC37: 'MyFlex - Attestation de scolarité',
  DOC38: 'MyFlex - Démission',
  DOC39: 'MyFlex - Avenant de contrat',
  DOC40: 'MyFlex - Acte de naissance Enfant',
  DOC41: 'MyFlex - Demande manuscrite',
  DOC42: 'MyFlex - demande d\'aménagement du durée',
  DOC43: 'MyFlex - Certificat de grossesse',
  DOC44: 'MyFlex - Rapport Médical',
  DOC45: 'MyFlex - Certificat d\'accouchement',
};

export default function ChatbotView() {
 
  const { full_name, id } = useParams();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [files, setFiles] = useState([]);
  const [DOCUMENTS, setDOCUMENTS] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.getDocumentsByCandidatId(id);
        setDOCUMENTS(response);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    fetchDocuments();
  }, [id]);

  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };

  const handleFileUpload = () => {
    // Handle file upload logic here
    console.log("Files uploaded:", files);
    setTimeout(() => setCurrentMessageIndex(1), 5000);
    setDOCUMENTS([]);
    // Optionally, you can reset the file state after upload
    // setFiles([]);
  };

  const renderDocuments = () => {
    if (DOCUMENTS.length === 0) {
      return <Typography variant="body1">Documents are already uploaded.</Typography>;
    }
    return (
      <>
        <Typography variant="body1">Hi {full_name}, Here is the list of documents you are supposed to upload:</Typography>
        <ul>
          {DOCUMENTS.map((document, index) => (
            <li key={index}>{itemDescriptions[document]}</li>
          ))}
        </ul>
        <input type="file" multiple onChange={handleFileChange} />
        <LoadingButton
          fullWidth
          size="large"
          type="button"
          variant="contained"
          color="inherit"
          onClick={handleFileUpload}
        >
          Upload
        </LoadingButton>
      </>
    );
  };

  return (
    <Box
      sx={{
        ...bgGradient({          
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Chatbot</Typography>
          <Divider sx={{ my: 3 }} />
          {currentMessageIndex === 0 && renderDocuments()}
        </Card>
      </Stack>
    </Box>
  );
}
