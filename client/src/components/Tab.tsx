import { FC, useMemo, PropsWithChildren } from 'react';
import { Box, Card, SxProps, Theme, useTheme } from '@mui/material';

type TabType = {
  isActive: boolean;
  value: string;
  onSwitch: (value: string) => void;
  icon?: JSX.Element;
  sx?: SxProps<Theme>;
  centered?: boolean;
  cancelOnClick?: boolean;
};
const Tab: FC<PropsWithChildren<TabType>> = ({
  children,
  value,
  isActive,
  onSwitch,
  icon,
  sx,
  centered = false,
  cancelOnClick = false,
}) => {
  const { palette } = useTheme();
  const activeStyle = useMemo(
    () =>
      isActive
        ? {
            bgcolor: `${palette.neutral.main} !important`,
            color: palette.neutral.light,
          }
        : {},
    [isActive, palette]
  );

  return (
    <Card
      onClick={() => {
        if (isActive && cancelOnClick) {
          onSwitch('');
        } else {
          onSwitch(value);
        }
      }}
      sx={{
        width: '100%',
        backgroundImage: 'none',
        display: 'flex',
        justifyContent: centered ? 'center' : 'start',
        p: '0.5rem',
        boxShadow: 'none',
        borderRadius: '0',
        transition: 'all 0.3s',
        ...activeStyle,
        '&:hover': { bgcolor: palette.neutral.light },
      }}
    >
      {icon}
      <Box display='flex' alignItems='center' sx={sx}>
        {children}
      </Box>
    </Card>
  );
};

export default Tab;
