import { Box } from '@mui/material';
import { MoonLoader } from 'react-spinners';
import { FC } from 'react';
import { LoaderSizeProps } from 'react-spinners/helpers/props';

const LoadingSpinner: FC<LoaderSizeProps> = ({ size }) => {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' p='2rem 0'>
      <MoonLoader size={size} />
    </Box>
  );
};

export default LoadingSpinner;
