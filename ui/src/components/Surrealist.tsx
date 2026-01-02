import React, { useEffect, useState } from 'react';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';

const Surrealist: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check if Surrealist is accessible
    const checkSurrealist = async () => {
      try {
        const response = await fetch('http://localhost:8001');
        if (response.ok) {
          setIsLoading(false);
        } else {
          setError('Surrealist is not responding. Please ensure the container is running.');
          setIsLoading(false);
        }
      } catch (err) {
        setError('Unable to connect to Surrealist. Please ensure the container is running.');
        setIsLoading(false);
      }
    };

    checkSurrealist();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '600px',
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Surrealist...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Typography sx={{ mt: 2 }}>
          Make sure the Surrealist container is running. You can start it from the Database Manager tab.
        </Typography>
      </Box>
    );
  }

  // Surrealist URL with connection parameters
  // The connection details will be pre-configured to connect to SurrealDB
  const surrealistUrl = 'http://localhost:8001';

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 200px)',
        overflow: 'auto',
      }}
    >
      <iframe
        src={surrealistUrl}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '4px',
        }}
        title="Surrealist"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
      />
    </Box>
  );
};

export default Surrealist;
