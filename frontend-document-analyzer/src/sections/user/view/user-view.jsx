import debounce from 'lodash/debounce';
import React, { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Import missing components
import Iconify from 'src/components/iconify';

// Adjust the import path as necessary
import Notification from './Notification';
import DocumentTable from './DocumentTable';
// Import DocumentToolbar component
import AddDocumentModal from './AddDocumentModal';
import { itemDescriptions } from '../../../_mock/document';
import { addDocumentsRequest, getCandidatDocuments } from '../../../services/service1'; // Adjust the import path as necessary

const UserPage = () => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('document_nom');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [documents, setDocuments] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addDocuments, setAddDocuments] = useState([]);
  const [notifSeverity, setNotifSeverity] = useState('success'); // Renamed to avoid shadowing
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifMessage, setNotifMessage] = useState(''); // Renamed to avoid shadowing
  const autoHideDuration = 1000;

  const handleOpen = (severity, message) => {
    setNotifSeverity(severity); // Use renamed state variables
    setNotifMessage(message); // Use renamed state variables
    setNotifOpen(true);
    setTimeout(() => {
      setNotifOpen(false);
    }, autoHideDuration);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotifOpen(false);
  };

  // Ensure fetchDocuments is stable using useCallback
  const fetchDocuments = useCallback(async () => {
    try {
      console.log('Fetching documents with filterName:', filterName);
      const candidatDocuments = await getCandidatDocuments(sessionStorage.getItem('candidateId'), filterName);
      setDocuments(candidatDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }, [filterName]); // Add filterName as a dependency

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]); // Add fetchDocuments as a dependency

  const handleFilterByNameDebounced = debounce((value) => {
    setFilterName(value.trim());
  }, 300);

  const handleFilterByName = (text) => {
    handleFilterByNameDebounced(text);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = documents.map((n) => n.document_nom);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selected, name];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddNewDocument = () => {
    setAddModalOpen(true);
  };

  const handleCloseModal = async () => {
    try {
      const response = await addDocumentsRequest(addDocuments, sessionStorage.getItem('candidateId'));
      if (response.status) {
        fetchDocuments();
        setAddDocuments([]);
        handleOpen('success', 'Document added successfully');
      } else {
        handleOpen('error', 'Failed to add document');
      }
    } catch (error) {
      console.error('Error adding documents:', error);
      handleOpen('error', 'Failed to add document');
    } finally {
      setAddModalOpen(false);
    }
  };

 



  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Documents</Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleAddNewDocument}
          startIcon={<Iconify icon="eva:plus-fill" />} // Iconify is now imported
        >
          New Doc
        </Button>
      </Stack>
      <Notification open={notifOpen} onClose={handleClose} message={notifMessage} severity={notifSeverity} />

      {/* Integrate DocumentToolbar here */}
      {/* <DocumentToolbar filterName={filterName} onFilterName={handleFilterByName} numSelected={selected.length} /> */}

      <DocumentTable
  documents={documents}
  page={page}
  rowsPerPage={rowsPerPage}
  order={order}
  orderBy={orderBy}
  selected={selected}
  filterName={filterName}
  handleSort={handleSort}
  handleSelectAllClick={handleSelectAllClick}
  handleClick={handleClick}
  handleChangePage={handleChangePage}
  handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleFilterByName={handleFilterByName} // Correct prop name here
        
/>

      <AddDocumentModal
        open={addModalOpen}
        onClose={handleCloseModal}
        itemDescriptions={itemDescriptions}
        addDocuments={addDocuments}
        setAddDocuments={setAddDocuments}
        handleSubmit={handleCloseModal}
      />
    </Container>
  );
};

export default UserPage;
