import React from 'react';
import { Box } from '@mui/material';

const Surrealist: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 200px)',
        overflow: 'auto',
        border: 'none',
      }}
    >
      <iframe
        src="http://localhost:8001"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Surrealist GUI"
      />
    </Box>
  );
};

export default Surrealist;
