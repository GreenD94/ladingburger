'use client';

import React from 'react';
import { Box } from '@mui/material';
import { TopBar } from '../components/TopBar.component';
import { HeroSection } from '../components/HeroSection.component';
import { MenuShowcase } from '../components/MenuShowcase.component';
import SocialProof from '../components/SocialProof.component';

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