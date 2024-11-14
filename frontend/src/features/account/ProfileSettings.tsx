import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Alert, Table, TableBody, TableCell, TableRow } from "@mui/material";
import agent from '../../app/api/agent';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { fetchCurrentUser, setUser } from '../../features/account/accountSlice';

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  Password?: string;
  newPassword?: string;
}

const ProfileSettings = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.account);

  const [profile, setProfile] = useState<ProfileFormValues>({ 
    firstName: '', 
    lastName: '', 
    Password: '', 
    newPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        await dispatch(fetchCurrentUser());
      }
      if (user) {
        setProfile({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          Password: '',
          newPassword: ''
        });
      }
      setLoading(false);
    };
    loadUserData();
  }, [dispatch, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setMessage({ text: "First name and last name cannot be empty.", type: 'error' });
      return;
    }

    try {
      await agent.Account.updateProfile(profile);
      setMessage({ text: "Profile updated successfully.", type: 'success' });
      setProfile({ ...profile, Password: '', newPassword: '' });
      dispatch(setUser({ ...user, firstName: profile.firstName, lastName: profile.lastName }));
    } catch (error) {
      setMessage({ text: "Error updating profile. Please check your information.", type: 'error' });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Profile Settings</Typography>
      
      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)} style={{ marginBottom: '1rem' }}>
          {message.text}
        </Alert>
      )}
      
      <Typography variant="h6" gutterBottom>Current Profile Information</Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><strong>First Name:</strong></TableCell>
            <TableCell>{user?.firstName || 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><strong>Last Name:</strong></TableCell>
            <TableCell>{user?.lastName || 'N/A'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <TextField
          name="firstName"
          label="First Name"
          value={profile.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="lastName"
          label="Last Name"
          value={profile.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="Password"
          label="Old Password"
          type="password"
          value={profile.Password || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          helperText="Enter your current password to make updates."
        />
        <TextField
          name="newPassword"
          label="New Password"
          type="password"
          value={profile.newPassword || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          helperText="Leave blank if you do not want to change the password."
        />
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfileSettings;
