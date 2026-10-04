import { z } from "zod";

export const inputSchema = z.object({
  resume: z.string().trim().min(50).max(15000),
  job: z.string().trim().min(50).max(15000),
  lang: z.enum(["en", "pt"]),
  password: z.string().optional(),
});

export const reportSchema = z.object({
  score: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  requirements: z.array(z.object({
    item: z.string().min(1),
    status: z.enum(["met", "partial", "gap"]),
    evidence: z.string(),
    suggestion: z.string(),
  })),
  missing_keywords: z.array(z.string()),
  rewrites: z.array(z.object({ original: z.string(), suggested: z.string() })),
});

export type Report = z.infer<typeof reportSchema>;