import { styled } from '@mui/system';
import { Box } from '@mui/material';

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: '1.5rem 1.5rem 0.75rem 1.5rem',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '0.75rem',
  boxShadow: '4px 4px 2rem 1px rgba(0, 0, 0, 0.1)',
}));

export default WidgetWrapper;
