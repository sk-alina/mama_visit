import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';

import Layout from './components/Layout';
import WelcomeSplash from './components/WelcomeSplash';
import Home from './pages/Home';
import Itinerary from './pages/Itinerary';
import Lodging from './pages/Lodging';
import Diary from './pages/Diary';
import Wishlist from './pages/Wishlist';
import Packing from './pages/Packing';
import Contact from './pages/Contact';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff6b9d',
      light: '#ffb3d1',
      dark: '#c73e6b',
    },
    secondary: {
      main: '#4ecdc4',
      light: '#7ee8e0',
      dark: '#2b9b94',
    },
    background: {
      default: '#fef7f0',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3436',
      secondary: '#636e72',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2d3436',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#2d3436',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#2d3436',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('mama-visit-welcomed');
    if (!hasVisited) {
      setShowWelcome(true);
      setIsFirstVisit(true);
    } else {
      setIsFirstVisit(false);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    localStorage.setItem('mama-visit-welcomed', 'true');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        {showWelcome && isFirstVisit && (
          <WelcomeSplash onComplete={handleWelcomeComplete} />
        )}
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/lodging" element={<Lodging />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/packing" element={<Packing />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Layout>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
