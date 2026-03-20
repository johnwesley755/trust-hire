import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Utility component that resets the scroll position to the top
 * whenever the route changes.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Reset scroll position to top
        window.scrollTo(0, 0);
        
        // Also handle cases where a custom scroll library like Lenis might be active
        // Use any to avoid complex interface conflicts with global Window
        const lenis = (window as any).lenis;
        if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
