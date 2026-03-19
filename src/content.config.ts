import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({
    base: 'src/content/projects',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    period: z.string(),
    challenge: z.string(),
    solution: z.string(),
    tech: z.array(z.string()),
    results: z.array(z.string()),
    order: z.number(),
    type: z.enum(['personal', 'work']),
    link: z.string().optional(),
    imageDark: z.string().optional(),
    imageLight: z.string().optional(),
  }),
});

export const collections = { projects };
