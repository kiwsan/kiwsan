import { describe, expect, it } from 'vitest';
import { buildProfileSchema } from './seo';

describe('buildProfileSchema', () => {
  it('uses the current role and a clean company name', () => {
    const schema = buildProfileSchema({
      role: 'AI Manager',
      company: 'MC Group (SET-listed)',
    });

    expect(schema['@type']).toBe('ProfilePage');
    expect(schema.mainEntity.jobTitle).toBe('AI Manager');
    expect(schema.mainEntity.worksFor.name).toBe('MC Group');
    expect(JSON.stringify(schema)).not.toContain('WorkRole');
    expect(JSON.stringify(schema)).not.toContain('FAQPage');
  });
});
