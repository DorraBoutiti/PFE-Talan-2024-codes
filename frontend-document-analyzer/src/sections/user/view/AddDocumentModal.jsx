// AddDocumentModal.js
import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel'; 

const AddDocumentModal = ({
  open, onClose, itemDescriptions, addDocuments, setAddDocuments, handleSubmit
}) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="add-document-modal-title"
    aria-describedby="add-document-modal-description"
  >
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography id="add-document-modal-title" variant="h6" component="h2" mb={2}>
        Add New Document
      </Typography>
      <FormControl fullWidth>
        <Autocomplete
          multiple
          id="items"
          options={Object.keys(itemDescriptions)}
          disableCloseOnSelect
          onChange={(event, newValue) => setAddDocuments(newValue)}
          renderOption={(props, option, { _selected }) => (
            <li {...props}>
              <FormControlLabel
                control={<Checkbox checked={_selected} />}
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
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        Send
      </Button>
    </Box>
  </Modal>
);

AddDocumentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemDescriptions: PropTypes.object.isRequired,
  addDocuments: PropTypes.array.isRequired,
  setAddDocuments: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default AddDocumentModal;
