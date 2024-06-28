import React from 'react';
import PropTypes from 'prop-types';

import MuiAlert from '@mui/material/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Notification({ open, onClose, message, severity }) {
  return (
    <div>
      {open && (
        <Alert onClose={onClose} severity={severity} sx={{ mb: 2 }} >
          {message}
        </Alert>
      )}
    </div>
  );
}

Notification.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.string.isRequired,  
};
