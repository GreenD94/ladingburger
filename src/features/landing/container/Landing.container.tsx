'use client';

import React from 'react';
import { Box } from '@mui/material';
import { TopBar } from '../components/TopBar';
import { HeroSection } from '../components/HeroSection';
import { MenuShowcase } from '../components/MenuShowcase';
import SocialProof from '../components/SocialProof';
import { Burger } from '@/features/database/types';

interface LandingContainerProps {
  initialBurgers?: Burger[];
}

export const LandingContainer: React.FC<LandingContainerProps> = ({ initialBurgers = [] }) => {
  return (
    <Box>
      <TopBar />
      <Box sx={{ pt: 8 }}>
        <HeroSection />
        <MenuShowcase initialBurgers={initialBurgers} />
        <SocialProof />
      </Box>
    </Box>
  );
};

export default LandingContainer; 