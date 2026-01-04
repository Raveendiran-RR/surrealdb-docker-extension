import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

interface SettingsProps {
  onSave: (settings: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSave }) => {
  const [settings, setSettings] = useState({
    host: 'localhost',
    port: '8000',
    username: 'root',
    password: 'root',
    namespace: null,
    database: null,
    autoConnect: true,
    strictMode: false,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('surrealdb-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem('surrealdb-settings', JSON.stringify(settings));
    onSave(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Connection Settings
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Host"
                value={settings.host}
                onChange={handleChange('host')}
                helperText="SurrealDB server hostname"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Port"
                value={settings.port}
                onChange={handleChange('port')}
                helperText="Server port (default: 8000)"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={settings.username}
                onChange={handleChange('username')}
                helperText="Database username"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={settings.password}
                onChange={handleChange('password')}
                helperText="Database password"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Namespace"
                value={settings.namespace}
                onChange={handleChange('namespace')}
                helperText="Database namespace"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Database"
                value={settings.database}
                onChange={handleChange('database')}
                helperText="Database name"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoConnect}
                    onChange={handleChange('autoConnect')}
                  />
                }
                label="Auto-connect on extension load"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.strictMode}
                    onChange={handleChange('strictMode')}
                  />
                }
                label="Strict mode (enforce data types)"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                size="large"
              >
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
