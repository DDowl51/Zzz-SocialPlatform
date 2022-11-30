import { FC, PropsWithChildren } from 'react';
import Footer from './Footer';
import Header from './Header';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '4.5rem' }}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
