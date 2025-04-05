import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Replace with your actual Facebook Pixel ID
const FB_PIXEL_ID = 'XXXXXXXXXX';

declare global {
  interface Window {
    fbq: any;
  }
}

const FacebookPixel = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Facebook Pixel
    const initPixel = () => {
      if (!window.fbq) {
        window.fbq = function() {
          // @ts-ignore
          window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
        };
        
        window.fbq.push = window.fbq;
        window.fbq.loaded = true;
        window.fbq.version = '2.0';
        window.fbq.queue = [];
      }
      
      window.fbq('init', FB_PIXEL_ID);
    };

    // Track page views when the location changes
    const trackPageView = () => {
      if (!window.fbq) return;
      window.fbq('track', 'PageView');
    };

    // Initialize and track the initial page load
    initPixel();
    trackPageView();

    // Track when the route changes
    const handleRouteChange = () => {
      trackPageView();
    };

    // Listen for route changes
    handleRouteChange();

    return () => {
      // Clean up if needed
    };
  }, [location]);

  return (
    <>
      {/* Facebook Pixel Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};

export default FacebookPixel;
