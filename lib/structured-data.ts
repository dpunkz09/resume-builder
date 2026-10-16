import { BRAND } from "@/components/landing/brand";

/**
 * Generate JSON-LD structured data for better SEO
 * Use in page.tsx files with: <script type="application/ld+json">{JSON.stringify(schema)}</script>
 */

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: process.env.NEXT_PUBLIC_APP_URL || "https://jpaworx.com",
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    description: BRAND.description,
    contactPoint: {
      "@type": "ContactPoint",
      email: BRAND.supportEmail,
      contactType: "Customer Support",
    },
    sameAs: [
      // Add your social media profiles here
      // "https://twitter.com/jpaworx",
      // "https://facebook.com/jpaworx",
      // "https://linkedin.com/company/jpaworx",
    ],
  };
}

export function getWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: BRAND.name,
    url: process.env.NEXT_PUBLIC_APP_URL || "https://jpaworx.com",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    description: BRAND.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free plan available with premium features",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jpaworx.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getProductSchema(
  name: string,
  description: string,
  price: string,
  currency: string = "USD"
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    },
  };
}
