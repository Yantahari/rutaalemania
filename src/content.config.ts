import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const actualidad = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/actualidad' }),
  schema: z.object({
    title: z.string().max(80),
    description: z.string().max(200),
    date: z.coerce.date(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    source: z.string(),
    sourceUrl: z.string().url(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { actualidad };
