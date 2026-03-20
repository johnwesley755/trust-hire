import { Outlet } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

const RootLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

export default RootLayout;
