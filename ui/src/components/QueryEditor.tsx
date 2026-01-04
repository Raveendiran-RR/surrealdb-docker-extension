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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    connectToDatabase();
  }, []);

  const connectToDatabase = async () => {
    try {
      const settings = localStorage.getItem('surrealdb-settings');
      const config = settings ? JSON.parse(settings) : {
        host: 'localhost',
        port: '8000',
        username: 'root',
        password: 'root',
        namespace: null,
        database: null,
      };

      // Sign in to get token
      const signinResponse = await fetch(`http://${config.host}:${config.port}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user: config.username,
          pass: config.password,
        }),
      });

      if (!signinResponse.ok) {
        throw new Error('Failed to authenticate');
      }

      const authData = await signinResponse.json();
      const authToken = authData.token;
      setToken(authToken);
      setConnected(true);
      setError(null);
      console.log('Connected to SurrealDB');
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(`Failed to connect: ${err.message || 'Connection refused. Make sure SurrealDB is running on port 8000.'}`);
      setConnected(false);
    }
  };

  const exampleQueries = [
    'SELECT * FROM users;',
    'CREATE users SET name = "John Doe", age = 30, email = "john@example.com";',
    'UPDATE users SET age = 31 WHERE name = "John Doe";',
    'DELETE users WHERE name = "John Doe";',
    'INFO FOR DB;',
  ];

  const executeQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    if (!connected || !token) {
      setError('Not connected to database. Please check Settings and ensure SurrealDB is running.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const startTime = performance.now();

    try {
      const settings = localStorage.getItem('surrealdb-settings');
      const config = settings ? JSON.parse(settings) : {
        host: 'localhost',
        port: '8000',
        namespace: null,
        database: null,
      };

      const response = await fetch(`http://${config.host}:${config.port}/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'NS': config.namespace,
          'DB': config.database,
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }

      const queryResult = await response.json();
      const endTime = performance.now();
      
      setExecutionTime(endTime - startTime);
      setResult(queryResult);
      console.log('Query result:', queryResult);
    } catch (err: any) {
      console.error('Query error:', err);
      setError(err.message || 'Failed to execute query');
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
          label={connected ? 'Connected' : 'Disconnected'} 
          color={connected ? 'success' : 'error'}
          size="small"
        />
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Write and execute SurrealQL queries against your database
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!connected && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Not connected to SurrealDB. Make sure the database is running on port 8000.
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
          placeholder="Enter your SurrealQL query here..."
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiInputBase-root': {
              fontFamily: 'monospace',
            },
          }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            onClick={executeQuery}
            disabled={loading || !connected}
          >
            Execute Query
          </Button>

          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearEditor}
          >
            Clear
          </Button>

          {!connected && (
            <Button
              variant="outlined"
              onClick={connectToDatabase}
            >
              Reconnect
            </Button>
          )}
        </Stack>
      </Paper>

      {result && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Query Results</Typography>
            {executionTime && (
              <Chip
                label={`Executed in ${executionTime.toFixed(2)}ms`}
                color="success"
                size="small"
              />
            )}
          </Stack>

          <Box
            sx={{
              bgcolor: 'grey.900',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: '400px',
            }}
          >
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
