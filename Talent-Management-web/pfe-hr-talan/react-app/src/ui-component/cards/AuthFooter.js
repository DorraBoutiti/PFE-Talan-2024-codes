import { Link, Typography, Stack } from '@mui/material';
// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://talan.com" target="_blank" underline="hover">
    talan.com
    </Typography>
    <Typography variant="subtitle2" target="_blank" underline="hover">
      &copy; Talan Tunisia
    </Typography>
  </Stack>
);

export default AuthFooter;