export interface ScaleDownResponse {
  compressed_prompt: string;
  model_used: string;
  original_prompt_tokens: number;
  compressed_prompt_tokens: number;
  successful: boolean;
  latency_ms: number;
  request_metadata: {
    compression_time_ms: number;
    compression_rate: string;
    prompt_length: number;
    compressed_prompt_length: number;
  };
}

const SCALEDOWN_API_URL = 'https://api.scaledown.xyz/compress/raw/';
const SCALEDOWN_API_KEY = 'v9mFeWolD7awrFatHjMEO3cEyL6ySy6WD5U9aNr0';

export const compressPrompt = async (
  context: string,
  prompt: string,
  model: string = 'gemini-2.5-flash'
): Promise<{ compressed: string; savedTokens: number }> => {
  try {
    const response = await fetch(SCALEDOWN_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': SCALEDOWN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        context,
        prompt,
        model,
        scaledown: {
          rate: 'auto'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ScaleDown API Error: ${(errorData as any)?.message || response.statusText}`);
    }

    const data: ScaleDownResponse = await response.json();

    if (!data.successful) {
      throw new Error('ScaleDown compression failed');
    }

    const savedTokens = data.original_prompt_tokens - data.compressed_prompt_tokens;
    return { compressed: data.compressed_prompt, savedTokens };
  } catch (error) {
    console.error('ScaleDown compression failed, using original prompt:', error);
    // Graceful fallback: return the original context if compression fails
    return { compressed: context, savedTokens: 0 };
  }
};
