import { GroqMessage, GroqResponse } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_ID = 'meta-llama/llama-4-maverick-17b-128e-instruct'; // Using Llama 3 70B for high intelligence

export const callGroqAgent = async (messages: GroqMessage[], temperature: number = 0.7, apiKey?: string): Promise<string> => {
  const key = apiKey || process.env.GROQ_API_KEY;

  if (!key) {
    throw new Error("No Groq API key provided. Enter your key in the input above, or set GROQ_API_KEY in .env.");
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: messages,
        temperature: temperature,
        max_tokens: 4096,
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data: GroqResponse = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Agent communication failed:", error);
    throw error;
  }
};
