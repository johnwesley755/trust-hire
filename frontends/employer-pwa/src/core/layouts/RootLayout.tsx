import { Outlet } from 'react-router-dom';
import ScrollToTop from '../utils/ScrollToTop';

const RootLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

export default RootLayout;
