import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Replace with your actual Google Analytics ID
const GA_TRACKING_ID = 'G-XXXXXXXXXX';

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views when the location changes
    const trackPageView = (url: string) => {
      if (!window.gtag) return;
      
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    };

    // Track the initial page load
    trackPageView(location.pathname + location.search);

    // Track when the route changes
    const handleRouteChange = () => {
      trackPageView(location.pathname + location.search);
    };

    // Listen for route changes
    handleRouteChange();

    return () => {
      // Clean up if needed
    };
  }, [location]);

  return (
    <>
      {/* Google Analytics Script */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname + window.location.search,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
