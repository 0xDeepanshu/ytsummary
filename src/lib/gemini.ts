import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API) {
  throw new Error("GEMINI_API environment variable is not defined");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API,
});

export default ai;
