import { Outlet } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from "./navbar";

// A custom theme for this app
const theme = createTheme({
  palette: {
    contrastThreshold: 4.5,
    primary: {
      main: '#edd492',
    },
    secondary: {
      main: '#7d510f',
    },
  },
});

function Copyright() {
  return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
  );
}

export default function RootLayout() {
  return (
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline />
          <Navbar serverCode={"de"}/>
          <main>
            <Outlet />
          </main>
          {/* Footer */}
          <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Typography variant="h6" align="center" gutterBottom>
              Footer
            </Typography>
            <Typography
                variant="subtitle1"
                align="center"
                color="text.secondary"
                component="p"
            >
              Something here to give the footer a purpose!
            </Typography>
            <Copyright />
          </Box>
          {/* End footer */}
        </>
      </ThemeProvider>
  )
};
