import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { NotificationListener } from '../../modules/dashboard/components/NotificationListener';
import ScrollToTop from '../utils/ScrollToTop';

const RootLayout = () => (
  <>
    <Toaster position="top-center" expand={true} richColors />
    <NotificationListener />
    <ScrollToTop />
    <Outlet />
  </>
);

export default RootLayout;
