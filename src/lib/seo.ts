import { SITE } from './site';

export interface ProfileSchemaInput {
  role: string;
  company: string;
}

const companyName = (company: string) => company.replace(/\s*\([^)]*\)\s*$/, '').trim();

export const buildProfileSchema = ({ role, company }: ProfileSchemaInput) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: SITE.fullName,
    alternateName: SITE.name,
    jobTitle: role,
    worksFor: {
      '@type': 'Organization',
      name: companyName(company),
    },
    url: SITE.url,
    image: `${SITE.url}/images/og-image.png?v=3`,
    description: SITE.description,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.location.locality,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.country,
    },
    sameAs: [...SITE.sameAs],
    knowsAbout: [...SITE.knowsAbout],
    knowsLanguage: [...SITE.knowsLanguage],
  },
});
