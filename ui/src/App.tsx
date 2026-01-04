import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import Surrealist from './components/Surrealist';
import DatabaseManager from './components/DatabaseManager';
import Settings from './components/Settings';
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
      style={{ height: '100%', display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
      {...other}
    >
      {value === index && <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>{children}</Box>}
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
        setErrorMessage('SurrealDB container is not running. Please start it from the Manager tab.');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      setErrorMessage('Failed to check SurrealDB status');
      console.error('Error checking SurrealDB status:', error);
    }
  };

  const handleSettingsSave = (settings: any) => {
    console.log('Settings saved:', settings);
    // You can add additional logic here, such as:
    // - Reconnecting to the database with new settings
    // - Updating connection status
    // - Notifying other components
    checkSurrealDBStatus();
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" id="#main" sx={{ p: '0 !important', height: '100vh' }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {errorMessage && (
          <Alert 
            severity="warning" 
            sx={{ mx: 2, mt: 2, flexShrink: 0 }} 
            onClose={() => setErrorMessage('')}
          >
            {errorMessage}
          </Alert>
        )}

        <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, gap: 2, flexShrink: 0 }}>
            <Typography variant="h5" component="h1" fontWeight="bold" sx={{ py: 1 }}>
              SurrealDB
            </Typography>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="SurrealDB tabs"
              sx={{ height: '100%', '& .MuiTab-root': { height: '100%', fontSize: '0.85rem' }, flexShrink: 0 }}
            >
              <Tab label="Surrealist" />
              <Tab label="Manager" />
              <Tab label="Help" />
            </Tabs>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <TabPanel value={tabValue} index={0}>
              <Surrealist />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Database Manager
                </Typography>
                <DatabaseManager 
                  onStatusChange={checkSurrealDBStatus}
                  connectionStatus={connectionStatus}
                />
                
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Settings
                </Typography>
                <Settings onSave={handleSettingsSave} />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Help />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}