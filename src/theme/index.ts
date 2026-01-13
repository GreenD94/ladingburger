'use client';

import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
};

export function createAdminTheme(themeMode: 'light' | 'dark'): Theme {
  if (themeMode === 'dark') {
    return createTheme({
      ...baseThemeOptions,
      palette: {
        mode: 'dark',
        primary: {
          main: '#64B5F6',
          light: '#90CAF9',
          dark: '#42A5F5',
          contrastText: '#000000',
        },
        secondary: {
          main: '#CE93D8',
          light: '#E1BEE7',
          dark: '#BA68C8',
          contrastText: '#000000',
        },
        background: {
          default: '#0F1419',
          paper: '#1A1F2E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0BEC5',
          disabled: '#6C757D',
        },
        divider: 'rgba(255, 255, 255, 0.08)',
        error: {
          main: '#EF5350',
          light: '#E57373',
          dark: '#C62828',
        },
        warning: {
          main: '#FFB74D',
          light: '#FFCC80',
          dark: '#F57C00',
        },
        info: {
          main: '#42A5F5',
          light: '#64B5F6',
          dark: '#1976D2',
        },
        success: {
          main: '#66BB6A',
          light: '#81C784',
          dark: '#388E3C',
        },
      },
      components: {
        ...baseThemeOptions.components,
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: '#1A1F2E',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              '&:hover': {
                backgroundColor: 'rgba(100, 181, 246, 0.08)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(100, 181, 246, 0.16)',
                '&:hover': {
                  backgroundColor: 'rgba(100, 181, 246, 0.24)',
                },
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: '#1A1F2E',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#64B5F6',
                },
              },
            },
          },
        },
        MuiSwitch: {
          styleOverrides: {
            switchBase: {
              '&.Mui-checked': {
                color: '#64B5F6',
              },
              '&.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#64B5F6',
              },
            },
            track: {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              backgroundColor: 'rgba(100, 181, 246, 0.12)',
              color: '#64B5F6',
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              '&.MuiTypography-h1, &.MuiTypography-h2, &.MuiTypography-h3, &.MuiTypography-h4, &.MuiTypography-h5, &.MuiTypography-h6': {
                color: '#FFFFFF',
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              '& .MuiTypography-root': {
                color: '#FFFFFF',
              },
            },
          },
        },
      },
    });
  }

  return createTheme({
    ...baseThemeOptions,
    palette: {
      mode: 'light',
      primary: {
        main: '#1976D2',
        light: '#42A5F5',
        dark: '#1565C0',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#9C27B0',
        light: '#BA68C8',
        dark: '#7B1FA2',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F5F7FA',
        paper: '#FFFFFF',
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
    },
  });
}

const defaultTheme = createAdminTheme('light');

export default defaultTheme; 