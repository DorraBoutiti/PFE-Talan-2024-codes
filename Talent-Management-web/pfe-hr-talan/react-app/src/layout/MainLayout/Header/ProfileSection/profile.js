import React, { useState, useEffect } from 'react';
import * as api from '../../../../services/authentification.service';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    IconButton,
    InputAdornment,
    Snackbar,
    MenuItem,
    Select,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FaUserEdit, FaKey, FaSave, FaTimes, FaEnvelope, FaBriefcase, FaBuilding, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: '80vw',
        margin: 'auto',
        marginTop: theme.spacing(4),
        padding: theme.spacing(4),
    },
    title: {
        marginBottom: theme.spacing(4),
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    input: {
        marginBottom: theme.spacing(3),
    },
    button: {
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    infoContainer: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    iconStyle: {
        marginRight: theme.spacing(1),
    },
}));

const Profile = () => {
    const classes = useStyles();
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        dep: '',
        pos: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [newPassword, setNewPass] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successNotification, setSuccessNotification] = useState(false);
    const [failNotification, setFailNotification] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userProfile = await api.getUserProfile();
            setUser(userProfile);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            await api.updateUserProfile(user);
            setIsEditing(false);
            fetchUserProfile();
            setSuccessNotification(true);
        } catch (error) {
            console.error('Error updating user profile:', error);
            setFailNotification(true);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            await api.setNewPass(newPassword);

            setOpenPasswordDialog(false);
            setSuccessNotification(true);
            setNewPass('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error changing password:', error);

            setFailNotification(true);
        }
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const departmentOptions = ['RH',
        'MANAGEMENT',
        'PRODUCTION',
        'HORS_PRODUCTION',
        'SUPPORT_PRODUCTION'];
    const positionOptions = ['DIRECTOR'];
    return (
        <Box>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h4" component="h4" className={classes.title}>
                        <FaUserEdit style={{ marginRight: '0.5rem' }} /> Account Information
                    </Typography>
                    {isEditing ? (
                        <>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        className={classes.input}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <FaUserEdit className={classes.iconStyle} />
                                                First Name
                                            </Box>
                                        }
                                        name="firstname"
                                        value={user.firstname}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        className={classes.input}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <FaUserEdit className={classes.iconStyle} />
                                                Last Name
                                            </Box>
                                        }
                                        name="lastname"
                                        value={user.lastname}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        className={classes.input}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <FaEnvelope className={classes.iconStyle} />
                                                Email
                                            </Box>
                                        }
                                        name="email"
                                        value={user.email}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        className={classes.input}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <FaBuilding className={classes.iconStyle} />
                                                Department
                                            </Box>
                                        }
                                        name="dep"
                                        value={user.dep}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        {departmentOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        className={classes.input}
                                        label={
                                            <Box display="flex" alignItems="center">
                                                <FaBriefcase className={classes.iconStyle} />
                                                Position
                                            </Box>
                                        }
                                        name="pos"
                                        value={user.pos}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        {positionOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                            <Box display="flex" justifyContent="flex-end">
                                <Button
                                    className={classes.button}
                                    variant="outlined"
                                    color="success"
                                    startIcon={<FaSave />}
                                    onClick={handleUpdate}
                                >
                                    Save
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="outlined"
                                    color="error"
                                    startIcon={<FaTimes />}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="outlined"
                                    startIcon={<FaKey />}
                                    onClick={() => setOpenPasswordDialog(true)}
                                >
                                    Edit Password
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Paper elevation={3} className={classes.infoContainer}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography className={classes.infoText}>
                                        <FaUserEdit className={classes.iconStyle} /> <strong>First Name:</strong> {user.firstname}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography className={classes.infoText}>
                                        <FaUserEdit className={classes.iconStyle} /> <strong>Last Name:</strong> {user.lastname}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={classes.infoText}>
                                        <FaEnvelope className={classes.iconStyle} /> <strong>Email:</strong> {user.email}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography className={classes.infoText}>
                                        <FaBuilding className={classes.iconStyle} /> <strong>Department:</strong> {user.dep}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography className={classes.infoText}>
                                        <FaBriefcase className={classes.iconStyle} /> <strong>Position:</strong> {user.pos}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Button
                                className={classes.button}
                                variant="contained"
                                startIcon={<FaUserEdit />}
                                onClick={() => setIsEditing(true)}
                                style={{ marginTop: '20px' }}
                            >
                                Edit Profile
                            </Button>
                        </Paper>
                    )}
                </CardContent>
            </Card>
            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} >
                <DialogTitle>
                    <FaKey style={{ marginRight: '0.5rem' }} /> Change Password
                </DialogTitle>
                <DialogContent >
                    <TextField
                        className={classes.input}
                        label={
                            <Box display="flex" alignItems="center">
                                <FaKey className={classes.iconStyle} />
                                New Password
                            </Box>
                        }
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPass(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={toggleShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        className={classes.input}
                        label={
                            <Box display="flex" alignItems="center">
                                <FaKey className={classes.iconStyle} />
                                Confirm Password
                            </Box>
                        }
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={toggleShowConfirmPassword}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenPasswordDialog(false)}
                        variant="outlined"
                        color="error"
                        startIcon={<FaTimes />}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={handlePasswordChange}
                        startIcon={<FaSave />}
                    >
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={successNotification}
                autoHideDuration={3000}
                onClose={() => setSuccessNotification(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Paper elevation={3} style={{ backgroundColor: 'green', color: 'white', padding: '10px', display: 'flex', alignItems: 'center' }}>
                    <FaCheckCircle style={{ marginRight: '5px' }} />
                    Success: Profile updated successfully!
                </Paper>
            </Snackbar>
            <Snackbar
                open={failNotification}
                autoHideDuration={3000}
                onClose={() => setFailNotification(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Paper elevation={3} style={{ backgroundColor: 'red', color: 'white', padding: '10px', display: 'flex', alignItems: 'center' }}>
                    <FaTimesCircle style={{ marginRight: '5px' }} />
                    Error: Failed to update profile!
                </Paper>
            </Snackbar>
        </Box>
    );
};

export default Profile;
