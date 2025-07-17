'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

interface ShareButtonsProps {
  className?: string;
  url?: string;
  title?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  className, 
  url = "https://bigbeautifulbillcalculator.org/", 
  title = "songless" 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
        }}
        className={className || ''}
      >
        <div 
          className="a2a_kit a2a_kit_size_32 a2a_default_style" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
          data-a2a-url={url}
          data-a2a-title={title}
        >
          <a className="a2a_dd" href="https://www.addtoany.com/share"></a>
          <a className="a2a_button_facebook"></a>
          <a className="a2a_button_mastodon"></a>
          <a className="a2a_button_email"></a>
          <a className="a2a_button_telegram"></a>
          <a className="a2a_button_google_gmail"></a>
          <a className="a2a_button_reddit"></a>
          <a className="a2a_button_x"></a>
          <a className="a2a_button_whatsapp"></a>
        </div>
      </div>
      <Script 
        id="addtoany-script"
        src="https://static.addtoany.com/menu/page.js"
        strategy="lazyOnload"
      />
    </>
  );
};

export default ShareButtons; 