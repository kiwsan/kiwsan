import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
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
  }),
});

export const collections = { projects };
