'use client';

import React from 'react';
import { Box } from '@mui/material';
import { TopBar } from '../components/TopBar';
import { HeroSection } from '../components/HeroSection';
import { MenuShowcase } from '../components/MenuShowcase';
import SocialProof from '../components/SocialProof';

export const LandingContainer = () => {
  return (
    <Box>
      <TopBar />
      <Box sx={{ pt: 8 }}>
        <HeroSection />
        <MenuShowcase />
        <SocialProof />
      </Box>
    </Box>
  );
};

export default LandingContainer; 