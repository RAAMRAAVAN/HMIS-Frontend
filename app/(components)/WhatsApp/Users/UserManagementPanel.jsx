'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DeleteOutline, EditOutlined, PersonAddAlt1 } from '@mui/icons-material';
import { getChatApiBaseUrl } from '@/utils/chatApiBase';

const EMPTY_FORM = {
  name: '',
  email: '',
  role: 'user',
  password: '',
};

const ALLOWED_ROLES = ['user', 'admin', 'superadmin'];

const commonFieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#f5f5f5',
    backgroundColor: '#323436',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4b4f53',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#646a70',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#21c063',
    },
    '&.Mui-disabled': {
      color: '#d8d8d8',
      backgroundColor: '#2b2e31',
    },
  },
  '& .MuiInputBase-input': {
    color: '#f5f5f5',
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#d8d8d8',
    color: '#d8d8d8',
  },
  '& .MuiSelect-select': {
    color: '#f5f5f5',
  },
  '& .MuiSelect-select.Mui-disabled': {
    WebkitTextFillColor: '#d8d8d8',
    color: '#d8d8d8',
  },
  '& .MuiInputLabel-root': {
    color: '#d0d0d0',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#21c063',
  },
  '& .MuiSvgIcon-root': {
    color: '#d0d0d0',
  },
};

function normalizeUserForEdit(user) {
  return {
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'user',
    password: '',
  };
}

const UserManagementPanel = () => {
  const apiBaseUrl = getChatApiBaseUrl();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);

  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deletingUserId, setDeletingUserId] = useState(null);

  const selectMenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: '#2b2e31',
        color: '#f5f5f5',
        border: '1px solid #4b4f53',
      },
    },
  };

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => Number(a.id) - Number(b.id)),
    [users]
  );

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${apiBaseUrl}/api/users`, {
        credentials: 'include',
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to load users');
      }

      setUsers(data.data || []);
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateCreateField = (key, value) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateEditField = (key, value) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetCreateDialog = () => {
    setCreateOpen(false);
    setCreateForm(EMPTY_FORM);
  };

  const beginEdit = (user) => {
    setEditUserId(user.id);
    setEditForm(normalizeUserForEdit(user));
    setActionMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setEditForm(EMPTY_FORM);
  };

  const submitCreate = async () => {
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      setError('Name, email and password are required');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const res = await fetch(`${apiBaseUrl}/api/users`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createForm.name.trim(),
          email: createForm.email.trim().toLowerCase(),
          password: createForm.password,
          role: createForm.role,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to create user');
      }

      setActionMessage('User created successfully');
      resetCreateDialog();
      await fetchUsers();
    } catch (createError) {
      setError(createError.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const submitEdit = async (userId) => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setError('Name and email are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
        role: editForm.role,
      };

      if (editForm.password.trim()) {
        payload.password = editForm.password;
      }

      const res = await fetch(`${apiBaseUrl}/api/users/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to update user');
      }

      setActionMessage('User updated successfully');
      cancelEdit();
      await fetchUsers();
    } catch (saveError) {
      setError(saveError.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async (userId) => {
    setDeletingUserId(userId);
    setError('');

    try {
      const res = await fetch(`${apiBaseUrl}/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to delete user');
      }

      setActionMessage('User deleted successfully');
      if (editUserId === userId) cancelEdit();
      await fetchUsers();
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      height="100dvh"
      sx={{ backgroundColor: '#1b1d20', color: '#fff', minHeight: 0 }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        py={1.5}
        sx={{ borderBottom: '1px solid #2b2b2b' }}
      >
        <Typography fontSize={20} fontWeight={600}>User Management</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddAlt1 />}
          onClick={() => {
            setActionMessage('');
            setError('');
            setCreateOpen(true);
          }}
          sx={{ backgroundColor: '#21c063', color: '#111', '&:hover': { backgroundColor: '#1bb056' } }}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ px: 2, pt: 1 }}>
        {error ? <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert> : null}
        {actionMessage ? <Alert severity="success" sx={{ mb: 1 }}>{actionMessage}</Alert> : null}
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {loading ? (
          <Typography sx={{ color: '#e0e0e0' }}>Loading users...</Typography>
        ) : (
          <Stack spacing={1.5}>
            {sortedUsers.map((user) => {
              const isEditing = editUserId === user.id;
              return (
                <Paper
                  key={user.id}
                  sx={{ p: 1.5, backgroundColor: '#26292d', border: '1px solid #4b4f53', color: '#fff' }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'stretch', md: 'center' }}>
                    <TextField
                      label="ID"
                      size="small"
                      value={user.id}
                      disabled
                      sx={{ minWidth: 70, ...commonFieldSx }}
                    />

                    <TextField
                      label="Name"
                      size="small"
                      value={isEditing ? editForm.name : user.name || ''}
                      onChange={(e) => updateEditField('name', e.target.value)}
                      disabled={!isEditing}
                      fullWidth
                      sx={commonFieldSx}
                    />

                    <TextField
                      label="Email"
                      size="small"
                      value={isEditing ? editForm.email : user.email || ''}
                      onChange={(e) => updateEditField('email', e.target.value)}
                      disabled={!isEditing}
                      fullWidth
                      sx={commonFieldSx}
                    />

                    <TextField
                      select
                      label="Role"
                      size="small"
                      value={isEditing ? editForm.role : (user.role || 'user')}
                      onChange={(e) => updateEditField('role', e.target.value)}
                      disabled={!isEditing}
                      SelectProps={{ MenuProps: selectMenuProps }}
                      sx={{ minWidth: 130, ...commonFieldSx }}
                    >
                      {ALLOWED_ROLES.map((roleValue) => (
                        <MenuItem key={roleValue} value={roleValue} sx={{ color: '#f5f5f5' }}>{roleValue}</MenuItem>
                      ))}
                    </TextField>

                    {isEditing ? (
                      <TextField
                        label="New Password (optional)"
                        size="small"
                        type="password"
                        value={editForm.password}
                        onChange={(e) => updateEditField('password', e.target.value)}
                        sx={{ minWidth: 210, ...commonFieldSx }}
                      />
                    ) : (
                      <Chip
                        label={user.is_online ? 'Online' : 'Offline'}
                        size="small"
                        sx={{ color: user.is_online ? '#21c063' : '#bbb', border: '1px solid #444', backgroundColor: 'transparent' }}
                      />
                    )}

                    <Box display="flex" alignItems="center" gap={0.5}>
                      {isEditing ? (
                        <>
                          <Button size="small" variant="contained" onClick={() => submitEdit(user.id)} disabled={saving}>
                            Save
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={cancelEdit}
                            sx={{ borderColor: '#646a70', color: '#e0e0e0' }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <IconButton size="small" onClick={() => beginEdit(user)}>
                          <EditOutlined sx={{ color: '#9ec5ff' }} />
                        </IconButton>
                      )}

                      <IconButton
                        size="small"
                        onClick={() => removeUser(user.id)}
                        disabled={deletingUserId === user.id}
                      >
                        <DeleteOutline sx={{ color: '#ff8a80' }} />
                      </IconButton>
                    </Box>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      <Dialog
        open={createOpen}
        onClose={resetCreateDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: '#23262a', border: '1px solid #4b4f53', color: '#fff' } }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Add User</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 1.5, pt: '10px !important' }}>
          <TextField
            label="Name"
            value={createForm.name}
            onChange={(e) => updateCreateField('name', e.target.value)}
            fullWidth
            sx={commonFieldSx}
          />
          <TextField
            label="Email"
            value={createForm.email}
            onChange={(e) => updateCreateField('email', e.target.value)}
            fullWidth
            sx={commonFieldSx}
          />
          <TextField
            select
            label="Role"
            value={createForm.role}
            onChange={(e) => updateCreateField('role', e.target.value)}
            fullWidth
            SelectProps={{ MenuProps: selectMenuProps }}
            sx={commonFieldSx}
          >
            {ALLOWED_ROLES.map((roleValue) => (
              <MenuItem key={roleValue} value={roleValue} sx={{ color: '#f5f5f5' }}>{roleValue}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Password"
            type="password"
            value={createForm.password}
            onChange={(e) => updateCreateField('password', e.target.value)}
            fullWidth
            sx={commonFieldSx}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={resetCreateDialog} sx={{ color: '#e0e0e0' }}>Cancel</Button>
          <Button variant="contained" onClick={submitCreate} disabled={creating} sx={{ backgroundColor: '#21c063', color: '#111', '&:hover': { backgroundColor: '#1bb056' } }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPanel;
