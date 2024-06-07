import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery,
  MenuItem
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signup } from '../../../../services/authentification.service';

const FirebaseRegister = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const navigate = useNavigate(); // Updated usage

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  const options = [
    { value: 'RH', label: 'RH' },
    { value: 'MANAGEMENT', label: 'Management' },
    { value: 'PRODUCTION', label: 'Production' },
    { value: 'SUPPORT_PRODUCTION', label: 'Support' },
    { value: 'HORS_PRODUCTION', label: 'Hors Production' },
  ];

  const Posoptions = [
    { value: 'DIRECTOR', label: 'Director' },
    /*{ value: 'MANAGER', label: 'Manager' },
    { value: 'CONSULTANT', label: 'Consultant' },*/
  ];

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          fname: '',
          lname: '',
          selectedDep: '',
          selectedPos: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          fname: Yup.string().max(255).required('First Name is required'),
          lname: Yup.string().max(255).required('Last Name is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).min(8, 'Password must be at least 8 characters long').matches(/[a-zA-Z]/, 'Password must contain at least one letter').matches(/[0-9]/, 'Password must contain at least one number').matches(/[!@#$%^&*(),.?":{}|<>+-]/, 'Password must contain at least one special character').required('Password is required'),
          selectedDep: Yup.string().required('Department is required'),
          selectedPos: Yup.string().required('Position is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const dataRegister={
            firstname: values.fname,
            lastname: values.lname,
            password: values.password,
            email: values.email,
            dep: values.selectedDep,
            pos: values.selectedPos
          }
          try {

            const response = await signup(dataRegister);
            console.log(response);
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
              navigate("/pages/login/login3");
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  name="fname"
                  type="text"
                  value={values.fname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.fname && errors.fname)}
                  helperText={touched.fname && errors.fname}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  name="lname"
                  type="text"
                  value={values.lname}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.lname && errors.lname)}
                  helperText={touched.lname && errors.lname}
                />
              </Grid>
            </Grid>
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={6} style={{ overflow: 'auto' }}>
                <TextField
                  fullWidth
                  label="Department"
                  select
                  value={values.selectedDep}
                  onChange={handleChange('selectedDep')}
                  error={Boolean(touched.selectedDep && errors.selectedDep)}
                  helperText={touched.selectedDep && errors.selectedDep}
                  id="select-department"
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} style={{ overflow: 'auto' }}>
                <TextField
                  fullWidth
                  select
                  label="Position"
                  value={values.selectedPos}
                  onChange={handleChange('selectedPos')}
                  error={Boolean(touched.selectedPos && errors.selectedPos)}
                  helperText={touched.selectedPos && errors.selectedPos}
                  id="select-position"
                >
                  {Posoptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-register">Email Address </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text--register">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-register">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {strength !== 0 && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign up
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseRegister;
