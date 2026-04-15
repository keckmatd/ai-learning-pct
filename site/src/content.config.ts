import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Slides Collection
 *
 * Each slide is a markdown file with frontmatter defining its position
 * in the presentation sequence.
 */
const slides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/slides' }),
  schema: z.object({
    title: z.string(),
    part: z.number().min(1).max(4),
    order: z.number().min(1),
    layout: z.enum(['title', 'content', 'split', 'code', 'quote']).optional().default('content'),
    notes: z.string().optional(),
    transition: z.string().optional(),
    sourceFile: z.string().optional(),
  }),
});

/**
 * Docs Collection
 *
 * Reference documentation, cheatsheets, and exercise walkthroughs.
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['cheatsheets', 'exercises', 'reference']),
    order: z.number().min(1),
    description: z.string().optional(),
  }),
});

export const collections = {
  slides,
  docs,
};
