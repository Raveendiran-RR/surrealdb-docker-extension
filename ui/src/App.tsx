import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  Paper,
  Alert,
} from '@mui/material';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import Surrealist from './components/Surrealist';
import Help from './components/Help';

const ddClient = createDockerDesktopClient();

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function App() {
  const [tabValue, setTabValue] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    checkSurrealDBStatus();
  }, []);

  const checkSurrealDBStatus = async () => {
    try {
      setConnectionStatus('connecting');
      // Check if SurrealDB container is running
      const result = await ddClient.docker.cli.exec('ps', [
        '--filter',
        'name=surrealdb',
        '--format',
        '{{.Status}}',
      ]);

      if (result.stdout && result.stdout.includes('Up')) {
        setConnectionStatus('connected');
        setErrorMessage('');
      } else {
        setConnectionStatus('disconnected');
        setErrorMessage('SurrealDB container is not running. Please start it from the Database Manager tab.');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      setErrorMessage('Failed to check SurrealDB status');
      console.error('Error checking SurrealDB status:', error);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      <Box sx={{ my: 1 }}>
        <Typography variant="h6" component="h1" gutterBottom sx={{ fontSize: '1.1rem', mb: 1 }}>
          SurrealDB Extension
        </Typography>

        {errorMessage && (
          <Alert severity="warning" sx={{ mb: 1, py: 0.5 }} onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        <Paper sx={{ mt: 1 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="SurrealDB tabs">
            <Tab label="Surrealist" disabled={connectionStatus !== 'connected'} />
            <Tab label="Help" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Surrealist />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Help />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}
