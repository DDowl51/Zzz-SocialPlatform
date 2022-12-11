import { useMediaQuery } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import Footer from './Footer';
import Header from './Header';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  return (
    <>
      <Header />
      <main style={{ paddingTop: !isNonMobileScreens ? '4.5rem' : '0' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
