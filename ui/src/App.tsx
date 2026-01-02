import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Paper,
  Typography,
} from '@mui/material';
import Surrealist from './components/Surrealist';
import Help from './components/Help';

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
      {value === index && <Box sx={{ height: '100%', width: '100%' }}>{children}</Box>}
    </div>
  );
}

export function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ p: 0, height: '100vh' }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ px: 2, pt: 2, pb: 1, flexShrink: 0 }}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              SurrealDB Extension
            </Typography>
          </Box>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="SurrealDB tabs"
            sx={{ minHeight: '40px', '& .MuiTab-root': { minHeight: '40px', fontSize: '0.85rem' }, flexShrink: 0 }}
          >
            <Tab label="Surrealist" />
            <Tab label="Help" />
          </Tabs>

          <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <TabPanel value={tabValue} index={0}>
              <Surrealist />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Help />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
