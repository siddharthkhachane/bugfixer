/**
 * Utility to interact with Hugging Face Inference API - CodeLlama model
 */
export async function fixCodeWithAI(code, language) {
  // Direct API key
  const HF_TOKEN = "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";
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${HF_TOKEN}`
  };

  // Use CodeLlama-7b which worked well
  const MODEL_URL = 'https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-hf';
  
  // Simple prompt focused on fixing
  const prompt = `Fix this ${language} code:

${code}

Fixed code:`;

  try {
    console.log("Sending request to Hugging Face API...");
    
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.1,
          do_sample: false,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      console.error("API Error Status:", response.status);
      throw new Error(`API returned ${response.status}`);
    }

    const result = await response.json();
    console.log("API Response received");
    
    // Extract the fixed code
    let fixedCode = result[0]?.generated_text || result.generated_text || '';
    
    // Simple post-processing
    fixedCode = fixedCode.trim();
    
    return { fixedCode, explanation: "" };
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    throw error; // Let the calling function handle the fallback
  }
}
