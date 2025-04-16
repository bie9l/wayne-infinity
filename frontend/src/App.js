import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';
import AppRoutes from './routes';
import Layout from './components/Layout';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App; 