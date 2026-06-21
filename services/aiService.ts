import OpenAI from 'openai';
import { RecruiterSimulationResponseSchema, RecruiterSimulationResponse } from '@/validations/aiValidations';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateResumeSuggestions(
  resumeText: string,
  jobDescription: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional career coach. Give specific, actionable suggestions to improve the resume for the given job description.',
        },
        {
          role: 'user',
          content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
        },
      ],
    });

    return completion.choices[0]?.message?.content || 'No suggestions available';
  } catch (error) {
    console.error('OpenAI error:', error);
    return 'Failed to generate suggestions. Please try again later.';
  }
}

export async function simulateRecruiter(
  resumeText: string,
  jobDescription: string
): Promise<RecruiterSimulationResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a hiring manager. Respond ONLY with valid JSON in this format: {"probability": 75, "verdict": "Your verdict here"}. Probability must be an integer between 0 and 100.',
        },
        {
          role: 'user',
          content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content || '';
    const parsedJson = JSON.parse(responseText);
    return RecruiterSimulationResponseSchema.parse(parsedJson);
  } catch (error) {
    console.error('OpenAI error:', error);
    return { probability: 0, verdict: 'Failed to simulate recruiter' };
  }
}