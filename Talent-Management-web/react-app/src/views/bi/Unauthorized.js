import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '78vh',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
}));

const UnauthorizedPage = () => {
  return (
    <StyledContainer>
      <Box display="flex" alignItems="center" mb={4}>
        <LockIcon fontSize="large" color="error" />
        <Typography variant="h4" color="error" ml={2}>
          Unauthorized Access
        </Typography>
      </Box>
      <Typography variant="body1" align="center" gutterBottom>
        Oops! It seems you&apos;re not authorized to access this content.
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
        You only have access to certain departments.
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
        If you believe this is an error, please contact the administrator immediately.
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        We apologize for the inconvenience.
      </Typography>
    </StyledContainer>
  );
};

export default UnauthorizedPage;