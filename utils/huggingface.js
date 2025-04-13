/**
 * Utility to interact with Hugging Face Inference API using StarCoder model
 */
export async function fixCode(code, language) {
  const HF_TOKEN = process.env.HUGGING_FACE_API_KEY;
  
  // Headers with authorization
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (HF_TOKEN) {
    headers['Authorization'] = `Bearer ${HF_TOKEN}`;
  }

  // Use StarCoder instead of CodeLlama
  const MODEL_URL = 'https://api-inference.huggingface.co/models/bigcode/starcoder';
  
  // Simpler prompt format that matches your working example
  const prompt = `### Buggy ${language}
${code}

### Fixed ${language}`;

  try {
    console.log("Sending request to Hugging Face API...");
    
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.1,
          top_p: 0.95,
          do_sample: true
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("API Error Details:", error);
      throw new Error(error.error || 'Failed to connect to Hugging Face API');
    }

    const result = await response.json();
    console.log("API Response received");
    
    // Extract the fixed code - different response format handling
    const generatedText = result[0]?.generated_text || result.generated_text || '';
    
    // Split to get just the fixed part (after the prompt)
    const promptParts = generatedText.split(`### Fixed ${language}`);
    const fixedCode = promptParts.length > 1 ? promptParts[1].trim() : generatedText;
    
    // Simple explanation
    const explanation = "I've analyzed your code and fixed the bugs. The corrected version should now run properly.";

    return { fixedCode, explanation };
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    throw error;
  }
}
