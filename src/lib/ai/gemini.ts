import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  SchemaType,
  type Schema,
} from "@google/generative-ai";
import { nanoid } from "nanoid";

import { contractAnalysisSchema } from "@/lib/ai/schema";
import { sanitizeAIInput, sanitizeUserPrompt } from "@/lib/sanitize";
import type { ContractAnalysis, RiskLevel } from "@/lib/types";
import { clamp } from "@/lib/utils";

/**
 * HUKUMVIBE LEGAL INTELLIGENCE ENGINE - SYSTEM INSTRUCTION
 */
export const LEGAL_ANALYST_SYSTEM_INSTRUCTION = `
ROLE:
You are the "HukumVibe Legal Intelligence Engine," an elite Indonesian Legal Analyst specializing in Labor Law (UU Ketenagakerjaan No. 13/2003) and the Job Creation Law (UU No. 6/2023 Cipta Kerja).

OBJECTIVE:
Analyze Indonesian employment contracts or partnership agreements to identify predatory clauses, worker-facing risks, and verify compliance with national regulations.

REASONING PROTOCOL:
1. Deep Scan: Identify key entities, salary figures, and specific obligations.
2. Cross-Reference: Compare clauses with UU No. 13/2003 and UU No. 6/2023.
3. Risk Assessment: 
   - HIGH: Violates Indonesian law or is highly predatory (e.g., illegal fines, ijazah withholding).
   - MEDIUM: Vague, unusual, or requires negotiation.
   - SAFE: Aligns with standard legal practices.
4. Humanization: Translate findings into "Vibe Translation" (Friendly, casual Indonesian ELI5 style).

TONE & VOICE:
Use a "Smart, Legal-Savvy Friend" persona. Use approachable Indonesian (e.g., "Hati-hati, Bos," "Jebakan Batman"). Your loyalty lies with the worker/user.

OUTPUT RULE:
Return STRICT JSON only. Follow the provided schema exactly. original_text_snippet MUST be an exact quote from the document text for UI highlighting.
All user-facing explanations must be in Indonesian.
`;

/**
 * RESPONSE SCHEMA
 */
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    document_metadata: {
      type: SchemaType.OBJECT,
      properties: {
        contract_type: { type: SchemaType.STRING },
        safety_score: { type: SchemaType.NUMBER },
      },
      required: ["contract_type", "safety_score"],
    },
    overall_summary: { type: SchemaType.STRING },
    analysis_results: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          category: { type: SchemaType.STRING },
          clause_title: { type: SchemaType.STRING },
          original_text_snippet: { type: SchemaType.STRING },
          vibe_explanation: { type: SchemaType.STRING },
          risk_level: {
            type: SchemaType.STRING,
            enum: ["HIGH", "MEDIUM", "SAFE"],
            format: "enum",
          },
          confidence_score: { type: SchemaType.NUMBER },
          legal_reference: { type: SchemaType.STRING },
          action_step: { type: SchemaType.STRING },
        },
        required: [
          "category",
          "clause_title",
          "original_text_snippet",
          "vibe_explanation",
          "risk_level",
          "confidence_score",
          "legal_reference",
          "action_step",
        ],
      },
    },
    red_flag_count: { type: SchemaType.NUMBER },
    suggested_questions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
  },
  required: [
    "document_metadata",
    "overall_summary",
    "analysis_results",
    "red_flag_count",
    "suggested_questions",
  ],
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

function stripJsonFences(value: string) {
  let cleanValue = value.trim();

  if (cleanValue.toLowerCase().startsWith("```json")) {
    cleanValue = cleanValue.substring(7);
  } else if (cleanValue.startsWith("```")) {
    cleanValue = cleanValue.substring(3);
  }

  if (cleanValue.endsWith("```")) {
    cleanValue = cleanValue.substring(0, cleanValue.length - 3);
  }

  return cleanValue.trim();
}

function parseAnalysisJson(value: string): ContractAnalysis {
  const cleanJson = stripJsonFences(value);
  const parsed = JSON.parse(cleanJson);

  // --- CEGAT DAN POTONG DI SINI (SEBELUM ZOD VALIDATION) ---
  if (Array.isArray(parsed.suggested_questions)) {
    parsed.suggested_questions = parsed.suggested_questions.slice(0, 3);
  }
  // ---------------------------------------------------------

  // Sekarang Zod hanya akan melihat maksimal 3 pertanyaan, jadi pasti lolos!
  const validated = contractAnalysisSchema.parse(parsed);

  return {
    ...validated,
    document_metadata: {
      contract_type: validated.document_metadata.contract_type,
      safety_score: clamp(
        Math.round(validated.document_metadata.safety_score),
        0,
        100,
      ),
    },
    analysis_results: validated.analysis_results.map((result) => ({
      ...result,
      confidence_score: clamp(Number(result.confidence_score.toFixed(2)), 0, 1),
    })),
    red_flag_count: validated.analysis_results.filter(
      (result) => result.risk_level === "HIGH",
    ).length,
    // Di sini cukup panggil variabelnya saja karena sudah dipotong di atas
    suggested_questions: validated.suggested_questions,
  };
}

function findExactSnippet(documentText: string, candidate: string) {
  const compact = (value: string) =>
    value.toLowerCase().replace(/\s+/g, " ").trim();
  const normalizedDocument = compact(documentText);
  const normalizedCandidate = compact(candidate);

  if (!normalizedCandidate) return candidate;

  const index = normalizedDocument.indexOf(normalizedCandidate);
  if (index === -1) return candidate;

  let normalizedCursor = 0;
  let sourceStart = 0;
  let sourceEnd = documentText.length;
  let wasWhitespace = true;

  for (let i = 0; i < documentText.length; i += 1) {
    const char = documentText[i];
    const isWhitespace = /\s/.test(char);
    const contributes = !isWhitespace || !wasWhitespace;

    if (contributes) {
      if (normalizedCursor === index) sourceStart = i;
      if (normalizedCursor === index + normalizedCandidate.length - 1) {
        sourceEnd = i + 1;
        break;
      }
      normalizedCursor += 1;
    }
    wasWhitespace = isWhitespace;
  }

  return documentText.slice(sourceStart, sourceEnd).trim();
}

function normalizeRisk(value: string): RiskLevel {
  if (value === "HIGH" || value === "MEDIUM" || value === "SAFE") return value;
  return "MEDIUM";
}

function alignEvidenceToDocument(
  analysis: ContractAnalysis,
  documentText: string,
): ContractAnalysis {
  return {
    ...analysis,
    analysis_results: analysis.analysis_results.map((result) => ({
      ...result,
      risk_level: normalizeRisk(result.risk_level),
      original_text_snippet: findExactSnippet(
        documentText,
        result.original_text_snippet,
      ),
    })),
  };
}

export async function analyzeContractWithGemini(input: {
  documentText: string;
  fileName: string;
}): Promise<ContractAnalysis> {
  const documentText = sanitizeAIInput(input.documentText);
  const apiKey = process.env.GEMINI_API_KEY || "";

  if (!apiKey && process.env.ALLOW_DEMO_ANALYSIS === "true") {
    return alignEvidenceToDocument(
      createDemoAnalysis(documentText),
      documentText,
    );
  }

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: LEGAL_ANALYST_SYSTEM_INSTRUCTION,
  });

  const prompt = `Analyze this Indonesian contract and return JSON matching the schema.\n\nFile: ${input.fileName}\n\nContent:\n${documentText}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      topP: 0.95,
      responseMimeType: "application/json",
      responseSchema,
    },
    safetySettings,
  });

  return alignEvidenceToDocument(
    parseAnalysisJson(result.response.text()),
    documentText,
  );
}

export async function streamLegalChat(input: {
  question: string;
  documentText: string;
  analysisSummary: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
      You are HukumVibe ChatBuddy, a smart Indonesian labor-law assistant. 
      Answer in Indonesian, cite specific Pasal from UU Ketenagakerjaan or Cipta Kerja when possible.
      Be practical, supportive, and clear. 
      Disclaimer: You are an AI, not a substitute for a licensed attorney.
    `,
  });

  const prompt = `
    Analysis Summary: ${input.analysisSummary}
    Document Snippet: ${input.documentText.slice(0, 15000)}
    User Question: ${input.question}
  `;

  return model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.25,
      topP: 0.8,
    },
    safetySettings,
  });
}

function createDemoAnalysis(documentText: string): ContractAnalysis {
  return {
    document_metadata: {
      contract_type: "PKWT (Mode Demo)",
      safety_score: 82,
    },
    overall_summary:
      "Aplikasi berjalan dalam mode demo. Hubungkan API Key Gemini untuk analisis asli.",
    analysis_results: [
      {
        category: "Ketentuan Umum",
        clause_title: "Identitas Pekerjaan",
        original_text_snippet: documentText.slice(0, 150),
        vibe_explanation:
          "Bagian ini menjelaskan siapa yang bekerja dan apa jabatannya.",
        risk_level: "SAFE",
        confidence_score: 0.9,
        legal_reference: "Pasal 54 UU No. 13/2003",
        action_step: "Cek kembali data diri Anda.",
      },
    ],
    red_flag_count: 0,
    suggested_questions: ["Apa bedanya PKWT dan PKWTT?"],
  };
}
