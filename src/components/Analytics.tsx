import Script from "next/script";

/**
 * Google Analytics 4 (GA4). Renders nothing unless NEXT_PUBLIC_GA_ID is set,
 * so it's safe to ship now and activate later by adding the env var in Vercel.
 * Get your ID (format: G-XXXXXXXXXX) from https://analytics.google.com.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
