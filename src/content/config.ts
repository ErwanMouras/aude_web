import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    image: z.string().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['interieur', 'objets', 'art', 'autres']),
    images: z.array(z.string()),
    featured: z.boolean().default(false),
    date: z.date(),
    location: z.string().optional(),
    client: z.string().optional()
  })
});

export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection
};