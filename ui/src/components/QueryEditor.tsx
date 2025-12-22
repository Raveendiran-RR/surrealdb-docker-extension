import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Clear as ClearIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

const QueryEditor: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM users;');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    connectToDatabase();
    const interval = setInterval(() => {
      if (!connected && !connecting) {
        connectToDatabase();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [connected, connecting]);

  const connectToDatabase = async () => {
    if (connecting) return;
    
    setConnecting(true);
    try {
      const settings = localStorage.getItem('surrealdb-settings');
      const config = settings ? JSON.parse(settings) : {
        host: 'localhost',
        port: '8001',
        username: 'root',
        password: 'root',
        namespace: 'test',
        database: 'test',
      };

      const authString = btoa(`${config.username}:${config.password}`);

      const response = await fetch(`http://${config.host}:${config.port}/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'application/json',
          'Authorization': `Basic ${authString}`,
        },
        body: `USE NS ${config.namespace}; USE DB ${config.database}; INFO FOR DB;`,
      });

      if (response.ok) {
        setConnected(true);
        setError(null);
        console.log('✅ Connected to SurrealDB');
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setConnected(false);
      if (err.message.includes('Failed to fetch')) {
        setError('Cannot reach SurrealDB on port 8001. Is it running?');
      } else if (err.message.includes('403')) {
        setError('Authentication failed. Using credentials: root/root');
      } else {
        setError(`Connection failed: ${err.message}`);
      }
    } finally {
      setConnecting(false);
    }
  };

  const exampleQueries = [
    'SELECT * FROM users;',
    'CREATE users SET name = "John Doe", age = 30;',
    'UPDATE users SET age = 31 WHERE name = "John Doe";',
    'DELETE users WHERE name = "John Doe";',
    'INFO FOR DB;',
  ];

  const executeQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    if (!connected) {
      setError('Not connected. Reconnecting...');
      await connectToDatabase();
      if (!connected) return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    const startTime = performance.now();

    try {
      const settings = localStorage.getItem('surrealdb-settings');
      const config = settings ? JSON.parse(settings) : {
        host: 'localhost',
        port: '8001',
        username: 'root',
        password: 'root',
        namespace: 'test',
        database: 'test',
      };

      const authString = btoa(`${config.username}:${config.password}`);
      const fullQuery = `USE NS ${config.namespace}; USE DB ${config.database}; ${query}`;

      const response = await fetch(`http://${config.host}:${config.port}/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'application/json',
          'Authorization': `Basic ${authString}`,
        },
        body: fullQuery,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText || response.statusText}`);
      }

      const queryResult = await response.json();
      const endTime = performance.now();
      
      setExecutionTime(endTime - startTime);
      setResult(queryResult);
    } catch (err: any) {
      console.error('Query error:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Connection lost');
        setConnected(false);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearEditor = () => {
    setQuery('');
    setResult(null);
    setError(null);
    setExecutionTime(null);
  };

  const loadExample = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <CodeIcon color="primary" fontSize="large" />
        <Typography variant="h5">Query Editor</Typography>
        <Chip 
          label={connecting ? 'Connecting...' : (connected ? 'Connected' : 'Disconnected')} 
          color={connected ? 'success' : 'error'}
          size="small"
        />
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Write and execute SurrealQL queries
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!connected && !connecting && (
        <Alert severity="warning" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={connectToDatabase}>
            Retry
          </Button>
        }>
          Not connected. Credentials: root/root, Port: 8001
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Example Queries
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" gap={1}>
          {exampleQueries.map((example, index) => (
            <Chip
              key={index}
              label={example.substring(0, 30) + '...'}
              onClick={() => loadExample(example)}
              variant="outlined"
              size="small"
            />
          ))}
        </Stack>

        <TextField
          fullWidth
          multiline
          rows={8}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter SurrealQL query..."
          variant="outlined"
          sx={{ mb: 2, '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            onClick={executeQuery}
            disabled={loading}
          >
            Execute
          </Button>

          <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearEditor}>
            Clear
          </Button>

          {!connected && (
            <Button variant="outlined" onClick={connectToDatabase} disabled={connecting}>
              {connecting ? 'Connecting...' : 'Reconnect'}
            </Button>
          )}
        </Stack>
      </Paper>

      {result && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Results</Typography>
            {executionTime && (
              <Chip label={`${executionTime.toFixed(2)}ms`} color="success" size="small" />
            )}
          </Stack>

          <Box sx={{ bgcolor: 'grey.900', p: 2, borderRadius: 1, overflow: 'auto', maxHeight: '400px' }}>
            <pre style={{ margin: 0, color: '#00ff00', fontFamily: 'monospace', fontSize: '14px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default QueryEditor;
