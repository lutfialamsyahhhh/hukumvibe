export type RiskLevel = "HIGH" | "MEDIUM" | "SAFE";

export type ContractType =
  | "PKWT"
  | "PKWTT"
  | "Internship"
  | "Freelance"
  | "Outsourcing"
  | "Unknown";

export interface DocumentMetadata {
  contract_type: string;
  safety_score: number;
}

export interface AnalysisResult {
  category: string;
  clause_title: string;
  original_text_snippet: string;
  vibe_explanation: string;
  risk_level: RiskLevel;
  confidence_score: number;
  legal_reference: string;
  action_step: string;
}

export interface ContractAnalysis {
  document_metadata: DocumentMetadata;
  overall_summary: string;
  analysis_results: AnalysisResult[];
  red_flag_count: number;
  suggested_questions: [string, string, string] | string[];
}

export interface TextPage {
  pageNumber: number;
  text: string;
}

export interface ExtractionQuality {
  score: number;
  keywordHits: number;
  warnings: string[];
}

export interface PdfExtractionResult {
  text: string;
  pages: TextPage[];
  strategy: "pdf-parse" | "pdfjs-layout" | "fallback";
  quality: ExtractionQuality;
  pageCount?: number;
}

export interface LegalDocumentValidation {
  isLegalContract: boolean;
  confidence: number;
  matchedSignals: string[];
  reason: string;
}

export interface AnalyzeContractResponse {
  documentId: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  extraction: Pick<PdfExtractionResult, "strategy" | "quality" | "pageCount">;
  validation: LegalDocumentValidation;
  extractedText: string;
  pages: TextPage[];
  analysis: ContractAnalysis;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface StoredDocument extends AnalyzeContractResponse {
  pdfUrl?: string;
  status: "analyzed" | "failed";
}

export interface DocumentHistoryItem {
  documentId: string;
  fileName: string;
  createdAt: string;
  size: number;
  safetyScore: number;
  redFlagCount: number;
  contractType: string;
  status: StoredDocument["status"];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
