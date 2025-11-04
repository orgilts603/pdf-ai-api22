
import { GoogleGenAI } from "@google/genai";


const gemini_ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});


export default gemini_ai