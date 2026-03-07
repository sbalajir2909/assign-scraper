import { z } from 'zod'

export const ConceptSchema = z.object({
  title: z.string().min(2).max(60),
  description: z.string().min(10),
  subtopics: z.array(z.string()).min(1).max(8),
  estimatedMinutes: z.number().min(5).max(120),
  prereq: z.string().nullable(),
  why: z.string().min(10),
  sources: z.array(z.string())
})

export const GistSchema = z.object({
  emphasis: z.string().min(20),
  outcomes: z.array(z.string()).min(2).max(6),
  prereqs: z.array(z.string())
})

export const CourseSchema = z.object({
  gist: GistSchema,
  concepts: z.array(ConceptSchema).min(4).max(10)
})

export type CourseSchemaType = z.infer<typeof CourseSchema>

export function validateSchema(data: unknown): { valid: boolean; errors: string[] } {
  const result = CourseSchema.safeParse(data)
  if (result.success) return { valid: true, errors: [] }
  return {
    valid: false,
    errors: result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`)
  }
}
