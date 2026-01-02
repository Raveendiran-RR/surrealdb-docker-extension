import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Paper,
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
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ p: 1 }}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="SurrealDB tabs"
            sx={{ minHeight: '40px', '& .MuiTab-root': { minHeight: '40px', fontSize: '0.85rem' } }}
          >
            <Tab label="Surrealist" />
            <Tab label="Help" />
          </Tabs>

          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
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
