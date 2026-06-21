import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface IEducation {
  school: string;
  degree?: string;
  field?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IProject {
  name: string;
  description?: string;
  technologies?: string[];
}

export interface IResume extends Document {
  userId: string;
  originalText: string;
  parsedData: {
    skills: string[];
    experience: IExperience[];
    education: IEducation[];
    projects: IProject[];
  };
  fileUrl?: string;
  fileName?: string;
  uploadThingKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema({
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const EducationSchema = new Schema({
  school: String,
  degree: String,
  field: String,
  startDate: Date,
  endDate: Date,
});

const ProjectSchema = new Schema({
  name: String,
  description: String,
  technologies: [String],
});

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    originalText: { type: String, required: true },
    parsedData: {
      skills: [String],
      experience: [ExperienceSchema],
      education: [EducationSchema],
      projects: [ProjectSchema],
    },
    fileUrl: String,
    fileName: String,
    uploadThingKey: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);