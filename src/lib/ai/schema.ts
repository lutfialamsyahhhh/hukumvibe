import { z } from "zod";

export const riskLevelSchema = z.enum(["HIGH", "MEDIUM", "SAFE"]);

export const analysisResultSchema = z.object({
  category: z.string().min(1),
  clause_title: z.string().min(1),
  original_text_snippet: z.string().min(1),
  vibe_explanation: z.string().min(1),
  risk_level: riskLevelSchema,
  confidence_score: z.coerce.number().min(0).max(1),
  legal_reference: z.string().min(1),
  action_step: z.string().min(1)
});

export const contractAnalysisSchema = z.object({
  document_metadata: z.object({
    contract_type: z.string().min(1),
    safety_score: z.coerce.number().min(0).max(100)
  }),
  overall_summary: z.string().min(1),
  analysis_results: z.array(analysisResultSchema),
  red_flag_count: z.coerce.number().int().min(0),
  suggested_questions: z.array(z.string().min(1)).min(3).max(3)
});

export type ContractAnalysisSchema = z.infer<typeof contractAnalysisSchema>;
