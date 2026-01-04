import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { createDockerDesktopClient } from '@docker/extension-api-client';

const ddClient = createDockerDesktopClient();

interface DatabaseManagerProps {
  onStatusChange: () => void;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

const DatabaseManager: React.FC<DatabaseManagerProps> = ({ onStatusChange, connectionStatus }) => {
  const [loading, setLoading] = useState(false);
  const [containerInfo, setContainerInfo] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchContainerInfo();
  }, []);

  const fetchContainerInfo = async () => {
    try {
      const result = await ddClient.docker.cli.exec('ps', [
        '--filter',
        'name=surrealdb',
        '--format',
        'json',
      ]);

      if (result.stdout) {
        try {
          const info = JSON.parse(result.stdout);
          setContainerInfo(info);
        } catch {
          setContainerInfo(null);
        }
      }
    } catch (error) {
      console.error('Error fetching container info:', error);
    }
  };

  const startSurrealDB = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await ddClient.docker.cli.exec('start', ['surrealdb']);
      await ddClient.docker.cli.exec('start', ['surrealist']);
      
      setMessage({ type: 'success', text: 'SurrealDB started successfully!' });
      setTimeout(() => {
        onStatusChange();
        fetchContainerInfo();
      }, 2000);
    } catch (error: any) {
      console.error('Start error:', error);
      const errorMsg = error?.message || error?.stderr || JSON.stringify(error) || 'Unknown error';
      setMessage({ type: 'error', text: `Failed to start SurrealDB: ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  const stopSurrealDB = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Try using compose down first
      try {
        await ddClient.extension.vm?.service?.post('/compose/down', {});
      } catch (composeError) {
        console.log('Compose down failed, using docker CLI:', composeError);
      }

      // Ensure containers are stopped and removed
      try {
        await ddClient.docker.cli.exec('stop', ['surrealdb']);
        // await ddClient.docker.cli.exec('rm', ['surrealdb']);
      } catch (e) {
        console.log('SurrealDB container cleanup:', e);
      }

      try {
        await ddClient.docker.cli.exec('stop', ['surrealist']);
        // await ddClient.docker.cli.exec('rm', ['surrealist']);
      } catch (e) {
        console.log('Surrealist container cleanup:', e);
      }
      
      setMessage({ type: 'success', text: 'SurrealDB stopped successfully!' });
      setTimeout(() => {
        onStatusChange();
        fetchContainerInfo();
      }, 1000);
    } catch (error: any) {
      console.error('Stop error:', error);
      const errorMsg = error?.message || error?.stderr || JSON.stringify(error) || 'Unknown error';
      setMessage({ type: 'error', text: `Failed to stop SurrealDB: ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  const restartSurrealDB = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await ddClient.docker.cli.exec('restart', ['surrealdb']);
      await ddClient.docker.cli.exec('restart', ['surrealist']);
      
      setMessage({ type: 'success', text: 'SurrealDB restarted successfully!' });
      setTimeout(() => {
        onStatusChange();
        fetchContainerInfo();
      }, 2000);
    } catch (error: any) {
      console.error('Restart error:', error);
      const errorMsg = error?.message || error?.stderr || JSON.stringify(error) || 'Unknown error';
      setMessage({ type: 'error', text: `Failed to restart SurrealDB: ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <StorageIcon color="primary" fontSize="large" />
                <Typography variant="h5">Database Status</Typography>
              </Stack>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={connectionStatus.toUpperCase()}
                  color={connectionStatus === 'connected' ? 'success' : 'default'}
                  sx={{ mb: 1 }}
                />
              </Box>

              {containerInfo && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Image: surrealdb/surrealdb:latest
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Port: 8000 (Host) → 8000 (Container)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Default Credentials: root/root
                  </Typography>
                </Box>
              )}

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                  onClick={startSurrealDB}
                  disabled={loading || connectionStatus === 'connected'}
                >
                  Start
                </Button>

                <Button
                  variant="outlined"
                  startIcon={loading ? <CircularProgress size={20} /> : <StopIcon />}
                  onClick={stopSurrealDB}
                  disabled={loading || connectionStatus === 'disconnected'}
                >
                  Stop
                </Button>

                <Button
                  variant="outlined"
                  startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                  onClick={restartSurrealDB}
                  disabled={loading || connectionStatus === 'disconnected'}
                >
                  Restart
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Start Guide
              </Typography>

              <Typography variant="body2" paragraph>
                1. Click <strong>Start</strong> to launch SurrealDB
              </Typography>

              <Typography variant="body2" paragraph>
                2. Access SurrealDB at <code>http://localhost:8000</code>
              </Typography>

              <Typography variant="body2" paragraph>
                3. Access Surrealist UI at <code>http://localhost:8001</code>
              </Typography>

              <Typography variant="body2" paragraph>
                4. Explore your data and query in the Surrealist tab
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Default credentials:
                <br />
                Username: <code>root</code>
                <br />
                Password: <code>root</code>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DatabaseManager;