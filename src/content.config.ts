import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    // A note without a title is a short note: it is shown in full on the index.
    title: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // One line under the title on the index.
    summary: z.string().optional(),
    // The boiled-down version, shown at the top of a long note.
    distillate: z.string().optional(),
    // Unfinished thinking; shown with a "rough" mark.
    rough: z.boolean().default(false),
    // Not published at all.
    draft: z.boolean().default(false),
    // Model(s) that drafted or revised the note, earliest first. Internal record only:
    // never rendered on the site (but visible to anyone reading the public source).
    model: z.union([z.string(), z.array(z.string())]).optional(),
    // Model(s) that did a separate review pass, if one happened. Also internal only.
    reviewed_by: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

export const collections = { notes };
