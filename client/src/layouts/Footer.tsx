import { Typography, useTheme } from '@mui/material';

const Footer = () => {
  const { palette } = useTheme();
  return (
    <footer>
      <Typography
        textAlign='center'
        fontSize='8px'
        color={palette.neutral.medium}
      >
        &copy; Copyright 2022.
      </Typography>
    </footer>
  );
};

export default Footer;
