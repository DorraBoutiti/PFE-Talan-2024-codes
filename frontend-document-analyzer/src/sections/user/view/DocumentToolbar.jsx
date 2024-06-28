// DocumentToolbar.js
import React from 'react';
import PropTypes from 'prop-types';

import UserTableToolbar from '../user-table-toolbar';

const DocumentToolbar = ({ numSelected, filterName, onFilterName }) => (
  <UserTableToolbar
    numSelected={numSelected}
    filterName={filterName}
    onFilterName={onFilterName}
  />
);

DocumentToolbar.propTypes = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
}

export default DocumentToolbar;
