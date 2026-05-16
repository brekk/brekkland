import { defineCollection } from "astro:content"

import { glob } from "astro/loaders"
import { z } from "astro/zod"

export default defineCollection({
  // Load Markdown and MDX files in the `src/content/projects/` directory.
  loader: glob({
    base: "./src/content/projects",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) =>
    z.object({
      repo: z.string(),
      title: z.string(),
      description: z.string(),
      version: z.string(),
      isPublished: z.boolean(),
      hasBinary: z.boolean(),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      image: z.optional(image()),
      dependencies: z.optional(z.array(z.string())),
      related: z.optional(z.array(z.string())),
      tags: z.optional(z.array(z.string())),
      hypothetical: z.boolean(),
    }),
})
