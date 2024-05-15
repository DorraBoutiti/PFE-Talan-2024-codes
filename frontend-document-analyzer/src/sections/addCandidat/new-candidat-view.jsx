import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import { alpha, useTheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';

import { bgGradient } from 'src/theme/css';
import  SearchBar  from '../../layouts/dashboard/common/searchbar';

import Logo from 'src/components/logo';

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

export default function AddCandidatView() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    documents: [],
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (event, newValue) => {
    console.log(newValue);
    setFormData({
      ...formData,
      documents: newValue,
    });
  };

  // Define setResults function
  const setResults = (results) => {
    // Your logic to handle results
    console.log(results);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addCandidatRequest(formData);
      console.log(response);
      setSubmitStatus('success');
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    }
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
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
    
      <SearchBar />
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Add New Candidat</Typography>
          <Divider sx={{ my: 3 }} />
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                name="full_name"
                label="Full Name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
              <TextField
                name="email"
                label="Email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Autocomplete
                multiple
                id="items"
                options={Object.keys(itemDescriptions)}
                disableCloseOnSelect
                onChange={handleSelectChange}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <FormControlLabel
                      control={<Checkbox checked={selected} />}
                      label={itemDescriptions[option]}
                      disabled
                    />
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select documents"
                    placeholder="Select documents"
                  />
                )}
              />
            </Stack>
            <Divider sx={{ my: 3 }} />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
            >
              Add Candidat
            </LoadingButton>
            {submitStatus === 'error' && (
              <Typography color="error">
                Error occurred while adding candidat. Please try again later.
              </Typography>
            )}
          </form>
        </Card>
      </Stack>
    </Box>
  );
}
