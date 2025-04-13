/**
 * Utility to interact with Hugging Face Inference API - DeepSeek Coder model
 */
export async function fixCode(code, language) {
  // Direct API key instead of environment variable
  const HF_TOKEN = "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";
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${HF_TOKEN}`
  };

  // DeepSeek-Coder - smaller model specialized for code
  const MODEL_URL = 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-1.3b-base';
  
  // Clear instruction-focused prompt
  const prompt = `You are a code fixing assistant. Fix the bugs in this ${language} code without adding comments or explanations:

\`\`\`${language}
${code}
\`\`\`

Fixed code:
\`\`\`${language}
`;

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
      const error = await response.json();
      console.error("API Error Details:", error);
      throw new Error(error.error || 'Failed to connect to Hugging Face API');
    }

    const result = await response.json();
    console.log("API Response received");
    
    // Extract the fixed code
    let fixedCode = result[0]?.generated_text || result.generated_text || '';
    
    // If the response contains a code block ending, remove it
    if (fixedCode.includes("\`\`\`")) {
      fixedCode = fixedCode.split("\`\`\`")[0].trim();
    }
    
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
