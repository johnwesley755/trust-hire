import { Outlet } from 'react-router-dom';
import ScrollToTop from '../utils/ScrollToTop';
import { Toaster } from 'sonner';
import { NotificationListener } from '../modules/dashboard/components/NotificationListener';
import { CookieConsentBanner } from '../components/common/CookieConsentBanner';

const RootLayout = () => (
  <>
    <Toaster position="top-right" expand={true} richColors />
    <NotificationListener />
    <ScrollToTop />
    <Outlet />
    <CookieConsentBanner />
  </>
);

export default RootLayout;
