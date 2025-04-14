/**
 * Utility to interact with Hugging Face Inference API - Faster StableCode model
 */
export async function fixCode(code, language) {
  // Direct API key
  const HF_TOKEN = "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";
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${HF_TOKEN}`
  };

  // Use StableCode Instruct 3B - much faster than CodeLlama
  const MODEL_URL = 'https://api-inference.huggingface.co/models/stabilityai/stablecode-instruct-alpha-3b';
  
  // Simple prompt focused on fixing with language-specific format
  const prompt = `<|system|>
You are an expert programmer who fixes bugs in code.
<|user|>
Fix this ${language} code. Only return the fixed code with no explanations:

${code}
<|assistant|>`;

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
      // Return original code if there's an error
      return {
        fixedCode: code,
        explanation: ""
      };
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
    
    // Return original code if there's an error
    return {
      fixedCode: code,
      explanation: ""
    };
  }
}
