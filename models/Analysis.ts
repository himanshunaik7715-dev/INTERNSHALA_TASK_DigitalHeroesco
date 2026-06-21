import mongoose, { Schema, Document } from 'mongoose';

export interface IATSScores {
  overallScore: number;
  keywordMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  formattingScore: number;
  readabilityScore: number;
}

export interface IAnalysis extends Document {
  userId: string;
  resumeId: mongoose.Schema.Types.ObjectId;
  jobDescription: string;
  atsScores: IATSScores;
  missingKeywords: string[];
  skillGaps: string[];
  aiSuggestions?: string;
  recruiterSimulation?: {
    probability: number;
    verdict: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    jobDescription: { type: String, required: true },
    atsScores: {
      overallScore: Number,
      keywordMatch: Number,
      skillsMatch: Number,
      experienceMatch: Number,
      educationMatch: Number,
      formattingScore: Number,
      readabilityScore: Number,
    },
    missingKeywords: [String],
    skillGaps: [String],
    aiSuggestions: String,
    recruiterSimulation: {
      probability: Number,
      verdict: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Analysis || mongoose.model<IAnalysis>('Analysis', AnalysisSchema);