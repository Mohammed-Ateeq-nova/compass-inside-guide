import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBRuV_cHEKMkCikwTbL1QjXzJj_nbAbEuU';

export const genAI = new GoogleGenerativeAI(API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export const geminiConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 1024,
};