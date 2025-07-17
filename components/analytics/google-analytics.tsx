"use client";

export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-HSF5XL17VM"></script>
      <script>
        {
          `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-HSF5XL17VM');`
        }
      </script>
    </>
  );
}