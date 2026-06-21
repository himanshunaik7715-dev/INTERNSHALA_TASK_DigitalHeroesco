import { getDocumentProxy, extractText } from "unpdf";
// import * as pdfjs from "pdfjs-dist";
// import * as pdfjs from "pdfjs-dist/legacy/build/pdf";
import * as mammoth from "mammoth";
import { IExperience, IEducation, IProject } from "@/models/Resume";
// import pdfParse from 'pdf-parse';

// ===============================
// FIX: safer worker setup (Next.js compatible)
// ===============================
// pdfjs.GlobalWorkerOptions.workerSrc =
//   `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ParsedResume {
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
}

// ===============================
// PDF PARSER (FIXED - REAL ERROR VISIBLE)
// ===============================
export async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
  try {
    if (!fileBuffer || fileBuffer.length < 100) {
      throw new Error("Invalid or empty PDF buffer");
    }

    const uint8Array = new Uint8Array(fileBuffer);
    const pdf = await getDocumentProxy(uint8Array);
    
    // ✅ FIX: Extract data segments safely
    const extractedData = await extractText(pdf);

    // ✅ FIX: unpdf text property can be an array of strings depending on the version.
    // We join the array pieces safely to prevent runtime crash on .trim()
    let combinedText = "";
    if (Array.isArray(extractedData.text)) {
      combinedText = extractedData.text.join(" ");
    } else if (typeof extractedData.text === "string") {
      combinedText = extractedData.text;
    }

    if (!combinedText || combinedText.trim() === "") {
      throw new Error("No readable text found inside PDF document layout");
    }

    return combinedText.trim();
  } catch (error: any) {
    console.error("[PDF PARSE ERROR]", error);
    throw new Error(
      `PDF parsing failed: ${error?.message || "unknown error"}`
    );
  }
}


// export async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
//   try {
//     if (!fileBuffer || fileBuffer.length < 100) {
//       throw new Error("Invalid or empty PDF buffer");
//     }

//     const data = await (pdfParse as any)(fileBuffer);

//     return data.text?.trim() || "";
//   } catch (error: any) {
//     console.error("[PDF PARSE ERROR]", error);
//     throw new Error(`PDF parsing failed: ${error?.message || "unknown error"}`);
//   }
// }

// ===============================
// DOCX PARSER (OK)
// ===============================
export async function extractTextFromDocx(fileBuffer: Buffer): Promise<string> {
  try {
    if (!fileBuffer || fileBuffer.length < 100) {
      throw new Error("Invalid or empty DOCX buffer");
    }

    const result = await mammoth.extractRawText({ buffer: fileBuffer });

    return result.value.trim();
  } catch (error: any) {
    console.error("[DOCX PARSE ERROR]", error);

    throw new Error(
      `DOCX parsing failed: ${error?.message || "unknown error"}`
    );
  }
}

// ===============================
// BASIC RESUME PARSER (UNCHANGED)
// ===============================
export function parseResumeText(text: string): ParsedResume {
  const lowerText = text.toLowerCase();

  const parsed: ParsedResume = {
    skills: [],
    experience: [],
    education: [],
    projects: [],
  };

  const commonSkills = [
    "javascript", "typescript", "python", "java", "react", "node.js",
    "next.js", "express", "mongodb", "postgresql", "aws", "docker",
    "kubernetes", "git", "html", "css", "tailwind", "redux", "vue",
    "angular", "spring", "django", "flask", "rest", "graphql", "api",
    "sql", "nosql", "redis", "firebase",
  ];

  parsed.skills = commonSkills
    .filter(skill => lowerText.includes(skill))
    .map(skill => skill.charAt(0).toUpperCase() + skill.slice(1));

  parsed.experience.push({
    company: "Company Placeholder",
    position: "Position Placeholder",
    startDate: new Date(),
  });

  parsed.education.push({
    school: "School Placeholder",
    degree: "Degree Placeholder",
  });

  return parsed;
}