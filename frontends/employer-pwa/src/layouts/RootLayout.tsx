import { Outlet } from 'react-router-dom';
import ScrollToTop from '../utils/ScrollToTop';
import { Toaster } from 'sonner';
import { NotificationListener } from '../modules/dashboard/components/NotificationListener';

const RootLayout = () => (
  <>
    <Toaster position="top-right" expand={true} richColors />
    <NotificationListener />
    <ScrollToTop />
    <Outlet />
  </>
);

export default RootLayout;
