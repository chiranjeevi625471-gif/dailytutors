import { siteConfig, absoluteUrl, sameAs } from "@/lib/site";

/**
 * Site-wide JSON-LD structured data: Organization (EducationalOrganization)
 * + WebSite. Helps Google understand the brand and show a richer result
 * (logo, name, knowledge panel) when people search "Daily Tutors".
 */
export default function StructuredData() {
  const graph = [
    {
      "@type": "EducationalOrganization",
      "@id": absoluteUrl("/#organization"),
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.png"),
        width: 512,
        height: 512,
      },
      image: absoluteUrl("/opengraph-image.png"),
      description: siteConfig.description,
      email: siteConfig.contactEmail,
      slogan: siteConfig.tagline,
      areaServed: { "@type": "Country", name: "India" },
      sameAs,
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.shortDescription,
      inLanguage: "en-IN",
      publisher: { "@id": absoluteUrl("/#organization") },
    },
  ];

  const json = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON in the DOM.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
