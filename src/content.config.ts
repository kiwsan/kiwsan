import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const projectFields = {
  title: z.string(),
  company: z.string(),
  period: z.string(),
  challenge: z.string(),
  solution: z.string(),
  tech: z.array(z.string()),
  results: z.array(z.string()),
  order: z.number(),
};

const workProject = z.object({
  ...projectFields,
  type: z.literal('work'),
  companySize: z.enum(['small', 'medium', 'large', 'enterprise']),
});

const personalProject = z.object({
  ...projectFields,
  type: z.literal('personal'),
  link: z.string().optional(),
  imageDark: z.string().optional(),
  imageLight: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({
    base: 'src/content/projects',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.discriminatedUnion('type', [workProject, personalProject]),
});

export const collections = { projects };
