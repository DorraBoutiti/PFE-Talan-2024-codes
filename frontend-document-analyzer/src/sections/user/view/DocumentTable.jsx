import React from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import { emptyRows } from '../utils';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import DocumentToolbar from './DocumentToolbar';
import TableEmptyRows from '../table-empty-rows';

const DocumentTable = ({
  documents,
  page,
  rowsPerPage,
  order,
  orderBy,
  selected,
  filterName,
  handleSort,
  handleSelectAllClick,
  handleClick,
  handleChangePage,
  handleChangeRowsPerPage,
  handleFilterByName,
  
}) => {
  const notFound = !documents.length && !!filterName;

  return (
    <Card>
      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          {/* DocumentToolbar component */}
          <DocumentToolbar filterName={filterName} onFilterName={handleFilterByName} numSelected={selected.length} />
          <Table sx={{ minWidth: 800 }}>           

            {/* UserTableHead component */}
            <UserTableHead
              order={order}
              orderBy={orderBy}
              rowCount={documents.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: 'document_nom', label: 'Document Name' },
                { id: 'document_dateTelechargement', label: 'Upload Date' },
                { id: 'document_type', label: 'Document Type' },
                { id: 'document_status', label: 'Document Status' },
                { id: '' },
              ]}
            />

            {/* TableBody with UserTableRow */}
            <TableBody>
              {documents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <UserTableRow
                    key={row.document_id}
                    element={row.document_id}
                    name={row.document_nom}
                    type={row.document_type}
                    status={row.document_status}
                    dateUpload={row.document_dateTelechargement}
                    selected={selected.indexOf(row.document_nom) !== -1}
                    handleClick={(event) => handleClick(event, row.document_nom)}
                  />
                ))}

              {/* Display empty rows if necessary */}
              <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, documents.length)} />

              {/* Display no data message if no documents found */}
              {notFound && <TableNoData query={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      {/* TablePagination component */}
      <TablePagination
        page={page}
        component="div"
        count={documents.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};

// PropType definitions
DocumentTable.propTypes = {
  documents: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  filterName: PropTypes.string.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleSelectAllClick: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleFilterByName: PropTypes.func.isRequired,
};

export default DocumentTable;
