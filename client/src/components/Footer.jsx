import React from 'react';
import { Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Container component="footer" style={{ backgroundColor: '#f1f1f1', padding: '20px', marginTop: '20px' }}>
      <Typography variant="body2" color="textSecondary" align="center">
        Singapore Management Hub © 2024
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        Nanyang Polytechnic, 180 Ang Mo Kio Ave 8, Singapore 569830
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        Contact Us: +65 1234 5678 | Email: Wate_Sigma@gmail.com
      </Typography>
    </Container>
  );
};

export default Footer;
