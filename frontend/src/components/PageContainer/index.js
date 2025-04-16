import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function PageContainer({ title, children }) {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Paper sx={{ p: 3 }}>
        {children}
      </Paper>
    </Box>
  );
}

export default PageContainer; 