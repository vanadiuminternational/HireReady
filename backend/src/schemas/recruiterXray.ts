import { z } from 'zod';

export const recruiterXrayRequestSchema = z.object({
  cvText: z.string().min(50, 'CV text must be at least 50 characters.'),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
  userTier: z.enum(['free', 'starter', 'pro', 'career_sprint']).optional().default('starter'),
});

export const recruiterXrayResultSchema = z.object({
  verdict: z.string().min(20),
  fit_score: z.number().int().min(0).max(100),
  top_concerns: z.array(z.string()).min(1).max(5),
  likely_interview_questions: z.array(z.string()).min(1).max(6),
  weakest_line: z.string().min(5),
  rewritten_bullet: z.string().min(5),
  quick_wins: z.array(z.string()).min(1).max(6),
  risk_flags: z.array(z.string()).max(6),
});

export type RecruiterXrayRequest = z.infer<typeof recruiterXrayRequestSchema>;
export type RecruiterXrayResult = z.infer<typeof recruiterXrayResultSchema>;
