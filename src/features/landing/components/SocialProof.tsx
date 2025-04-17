'use client';

import React from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { motion } from 'framer-motion';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';

const testimonials = [
  {
    name: 'María González',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=maria',
    text: "¡Las mejores hamburguesas que he probado en Barquisimeto! La calidad y el sabor son inigualables.",
    rating: 5
  },
  {
    name: 'Carlos Rodríguez',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=carlos',
    text: 'Servicio increíble y comida deliciosa. ¡Definitivamente volveré!',
    rating: 5
  },
  {
    name: 'Ana Martínez',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=ana',
    text: 'El lugar perfecto para los amantes de las hamburguesas en Barquisimeto. ¡Altamente recomendado!',
    rating: 4
  }
];

const SocialProof: React.FC = () => {

  return (
    <Box sx={{ position: 'relative', py: 8 }}>
      {/* Floating Social Buttons */}
      <Box
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          zIndex: 1000
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="contained"
            startIcon={<WhatsAppIcon />}
            href="https://wa.me/584125188174"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              bgcolor: '#25D366',
              '&:hover': { bgcolor: '#128C7E' },
              color: 'white',
              borderRadius: '50px',
              minWidth: 'auto',
              p: 1.5,
              '& .MuiButton-startIcon': {
                margin: 0
              }
            }}
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="contained"
            startIcon={<InstagramIcon />}
            href="https://www.instagram.com/jesusg_sanchez/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              bgcolor: '#E1306C',
              '&:hover': { bgcolor: '#C13584' },
              color: 'white',
              borderRadius: '50px',
              minWidth: 'auto',
              p: 1.5,
              '& .MuiButton-startIcon': {
                margin: 0
              }
            }}
          />
        </motion.div>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ 
            mb: 6, 
            fontWeight: 'bold',
            color: '#2C1810',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '4px',
              bgcolor: '#FF6B00',
              borderRadius: '2px',
            },
          }}
        >
          Lo Que Dicen Nuestros Clientes
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 4,
          justifyContent: 'center',
        }}>
          {testimonials.map((testimonial, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                style={{ width: '100%', maxWidth: '360px' }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ color: '#2C1810' }}>{testimonial.name}</Typography>
                      <Box sx={{ display: 'flex', mt: 0.5 }}>
                        {[...Array(5)].map((_, i) => (
                          <Typography
                            key={i}
                            sx={{
                              color: i < testimonial.rating ? '#FF6B00' : 'grey.300'
                            }}
                          >
                            ★
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ flexGrow: 1, color: 'text.secondary' }}
                  >
                    {testimonial.text}
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SocialProof; 