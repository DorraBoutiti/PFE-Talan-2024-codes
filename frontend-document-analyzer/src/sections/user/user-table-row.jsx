import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import MobileStepper from '@mui/material/MobileStepper';
import {
  Box,
  Stack,
  Modal,
  Avatar,
  Button,
  Select,
  Popover,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
} from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import * as api from '../../services/service1';

export default function UserTableRow({
  selected,
  element,
  name,
  type,
  status,
  dateUpload,
  handleClick,
  dataFiltered = [],
  setPage,
  rowsPerPage,
  page,
  updateDataFiltered,
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [infos, setInfos] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newFields, setNewFields] = useState([]);
  const [combinedFields, setCombinedFields] = useState([]);

  useEffect(() => {
    if (modalOpen) {
      handleEdit(element);
    }
  }, [element, modalOpen]);

  // Function to add a new field
  const handleAddNewField = () => {
    const nextId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setNewFields([...newFields, { id: nextId, label: '', value: '' }]);
  };


  // Function to handle changes in the new field inputs
  const handleNewFieldChange = (index, field, value) => {
    const updatedFields = newFields.map((item, idx) =>
      idx === index ? { ...item, [field]: value } : item
    );
    setNewFields(updatedFields);

    // Update combinedFields when both label and value are filled
    if (field === 'value' && value !== '') {
      const { label } = updatedFields[index];
      const newCombinedField = { id: index, label, value };
      setCombinedFields([...combinedFields.filter(_field => _field.id !== index), newCombinedField]);
    }
  };

  const handleOpenMenu = (event) => {
    setPopoverOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setPopoverOpen(false);
  };

  const handleEdit = async (documentId) => {
    try {
      const _infos = await api.fetchDocumentInfos(documentId);
      console.log(_infos);
      setInfos(_infos.informations);

      const uint8Array = new Uint8Array(_infos.file.data);
      const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
      const reader = new FileReader();
      reader.onload = function function1(event) {
        const text = event.target.result;
        try {
          const imagesList = JSON.parse(text);
          setImages(imagesList);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.onerror = function function2(event) {
        console.error('File reading error:', event);
      };
      reader.readAsText(blob);
    } catch (error) {
      console.error('Error fetching document infos:', error);
    }
  };

  const handleFormOpen = async (documentId) => {
    setPopoverOpen(false);
    await handleEdit(documentId);
    setModalOpen(true);
  };

  const handleFormClose = () => {
    setModalOpen(false);
  };

  const handleInputChange = (event, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: event.target.value,
    });
  };

  const handleRemoveNewField = (index) => {
    const updatedFields = newFields.filter((item, idx) => idx !== index);
    setNewFields(updatedFields);
  };

  const handleValidateNewField = (index) => {
    // Get the field to be validated
    const fieldToValidate = newFields[index];

    // Check if both label and value are filled
    if (fieldToValidate.label && fieldToValidate.value) {
      // Add the new field to the infos array
      setInfos((prevInfos) => [
        ...prevInfos,
        {
          id: fieldToValidate.id,
          nomChamp: fieldToValidate.label,
          valeur: fieldToValidate.value,
        },
      ]);

      // Update the combined fields
      setCombinedFields((prevCombinedFields) => [
        ...prevCombinedFields,
        {
          id: fieldToValidate.id,
          label: fieldToValidate.label,
          value: fieldToValidate.value,
        },
      ]);

      // Remove the validated field from newFields
      setNewFields((prevNewFields) => prevNewFields.filter((_, idx) => idx !== index));
    } else {
      console.warn('Both label and value must be filled to validate a new field.');
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    // Concatenate infos and newFields for submission
    const jsonObject = {
      documentId: element,
      fields: [...infos, ...newFields].map((info) => ({
        nomChamp: info.nomChamp,
        valeur: formData[info.nomChamp] !== undefined ? formData[info.nomChamp] : info.valeur,
      })),
    };

    console.log('Form submitted with data:', JSON.stringify(jsonObject, null, 2));
    setModalOpen(false);
  };

  const handleReject = () => {
    console.log('Rejected');
    handleFormClose();
  };

  const handleNext = () => {
    console.log('Next');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    console.log('Back');
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getColorByStatus = (document_status) => {
    switch (document_status) {
      case 'In Progress':
        return 'info';
      case 'Pending':
        return 'error';
      case 'Validated':
        return 'success';
      case 'Closed':
        return 'text.primary';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src="/static/mock-images/avatars/avatar_default.jpg" />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{new Date(dateUpload).toLocaleDateString()}</TableCell>

        <TableCell>{type}</TableCell>

        <TableCell>
          <Label color={getColorByStatus(status)}>{status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 300 },
        }}
      >
        <MenuItem onClick={() => handleFormOpen(element)}>
          <Iconify icon="eva:edit-2-outline" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Modal
        open={modalOpen}
        onClose={handleFormClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <IconButton
            onClick={handleFormClose}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 999,
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'white', // Ensure background stays white on hover
              },
            }}
          >
            <Iconify icon="eva:close-outline" sx={{ color: 'blue' }} />
          </IconButton>

          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '100%',
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              boxShadow: 24,
              display: 'flex',
              flexDirection: 'column',
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Document View
            </Typography>

            <Box sx={{ display: 'flex', width: '100%', mt: 2 }}>
              <Box sx={{ width: '50%', pr: 1, overflowY: 'auto' }}>
                {images.length > 0 ? (
                  <img
                    src={`data:image/png;base64,${images[activeStep]}`}
                    alt={`Document ${activeStep + 1}`}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                ) : (
                  <Typography>No File data available or data corrupted</Typography>
                )}

                <MobileStepper
                  variant="dots"
                  steps={images.length}
                  position="static"
                  activeStep={activeStep}
                  nextButton={<Button size="small" onClick={handleNext} disabled={activeStep === images.length - 1}>Next</Button>}
                  backButton={<Button size="small" onClick={handleBack} disabled={activeStep === 0}>Back</Button>}
                  sx={{ mt: 2 }}
                />
              </Box>

              <Box sx={{ width: '50%', pl: 1, maxHeight: 'calc(90vh - 150px)', overflowY: 'auto' }}>
                <Typography variant="h6">Edit Form</Typography>
                {infos.length > 0 ? (
                  <form onSubmit={handleSubmit}>
                    <Button
                      variant="contained"
                      sx={{ mb: 2, position: 'right' }}
                      startIcon={<Iconify icon="eva:plus-fill" />}
                      onClick={handleAddNewField}
                    >
                      Add
                    </Button>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="select-type-label">Type</InputLabel>
                      <Select
                        labelId="select-type-label"
                        id="select-type"
                        value={type || 'Unknown'}
                        label="Type"
                        onChange={(e) => handleInputChange(e, 'type')}
                      >
                        <MenuItem value="Document Type Not Recognized">Document Type Not Recognized</MenuItem>
                        <MenuItem value="Type2">Type2</MenuItem>
                        <MenuItem value="Type3">Type3</MenuItem>
                      </Select>
                    </FormControl>

                    {infos.map((info) => (
                      <TextField
                        key={info.id}
                        label={info.nomChamp}
                        value={formData[info.nomChamp] !== undefined ? formData[info.nomChamp] : info.valeur}
                        onChange={(e) => handleInputChange(e, info.nomChamp)}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                    ))}

                    {newFields.map((field, index) => (
                      <Box key={field.id} sx={{ mb: 2, display: 'flex', gap: 1 }}>
                        <TextField
                          label={`Label ${index + 1}`}
                          value={field.label}
                          onChange={(e) => handleNewFieldChange(index, 'label', e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label={`Value ${index + 1}`}
                          value={field.value}
                          onChange={(e) => handleNewFieldChange(index, 'value', e.target.value)}
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveNewField(index)}
                          sx={{ zIndex: 999 }}
                        >
                          <Iconify icon="eva:close-outline" />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleValidateNewField(index)}
                          sx={{ zIndex: 999 }}
                        >
                          <Iconify icon="eva:plus-fill" />
                        </IconButton>
                      </Box>
                    ))}

                    <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                      Validate
                    </Button>
                    <Button onClick={handleReject} variant="outlined">
                      Reject
                    </Button>
                  </form>
                ) : (
                  <Typography>No data exists</Typography>
                )}
              </Box>
            </Box>
          </Box>
        </div>
      </Modal>
    </>
  );
}

UserTableRow.propTypes = {
  dateUpload: PropTypes.any,
  element: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  type: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  dataFiltered: PropTypes.array,
  setPage: PropTypes.func,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  updateDataFiltered: PropTypes.func,
};