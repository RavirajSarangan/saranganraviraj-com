import {
  certifications,
  education,
  experience,
  site,
  skills,
  socials,
  stack,
  type Project,
} from "@/content/site";
import type { Post } from "@/content/posts";

/**
 * Structured data, emitted from Server Components as `application/ld+json`.
 *
 * Everything here is built from the same `content/site.ts` the page renders from, so
 * the markup can never claim something the visible page does not — which is both the
 * honest position and the one search engines penalise you for getting wrong.
 */
function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is not user input and contains no closing script tags.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const PERSON_ID = `${site.url}/#person`;

/** The identity graph — worksFor, alumniOf, credentials, and what he actually knows. */
export function PersonJsonLd() {
  const current = experience.filter((r) => r.end === null);

  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": PERSON_ID,
        name: site.name,
        jobTitle: site.role,
        email: `mailto:${site.email}`,
        url: site.url,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Jaffna",
          addressCountry: "LK",
        },
        sameAs: socials
          .filter((s) => !s.href.startsWith("mailto:"))
          .map((s) => s.href),
        worksFor: current.map((r) => ({
          "@type": "Organization",
          name: r.org,
        })),
        alumniOf: education.map((e) => ({
          "@type": "EducationalOrganization",
          name: e.institution,
        })),
        hasCredential: certifications.map((c) => ({
          "@type": "EducationalOccupationalCredential",
          name: c.name,
          credentialCategory: "certificate",
          recognizedBy: { "@type": "Organization", name: c.issuer },
          url: c.verifyUrl,
        })),
        knowsAbout: [...skills, ...stack].flatMap((g) => g.items),
        knowsLanguage: ["Tamil", "English"],
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: site.url,
        name: site.name,
        author: { "@id": PERSON_ID },
        inLanguage: "en",
      }}
    />
  );
}

export function ArticleJsonLd({ post }: { post: Post }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        // No separate modified date is tracked, so publication stands for both
        // rather than inventing a fresher one.
        dateModified: post.date,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        articleSection: post.category,
        wordCount: post.body.reduce((n, b) => n + b.text.split(/\s+/).length, 0),
        mainEntityOfPage: `${site.url}/blog/${post.slug}`,
        inLanguage: "en",
      }}
    />
  );
}

export function ProjectJsonLd({ project }: { project: Project }) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        creator: { "@id": PERSON_ID },
        dateCreated: project.year,
        genre: project.sector,
        keywords: project.stack.join(", "),
        ...(project.liveUrl ? { url: project.liveUrl } : {}),
        mainEntityOfPage: `${site.url}/work/${project.slug}`,
      }}
    />
  );
}

/** Trail for nested routes — home › section › page. */
export function BreadcrumbJsonLd({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{ name: "Home", path: "" }, ...trail].map(
          (item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${site.url}${item.path}`,
          }),
        ),
      }}
    />
  );
}
