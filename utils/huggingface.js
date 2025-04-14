/**
 * Utility to interact with Hugging Face Inference API - DeepSeek Coder 6B model
 */
export async function fixCode(code, language) {
  // Direct API key
  const HF_TOKEN = "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";
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${HF_TOKEN}`
  };

  // Use DeepSeek Coder 6B model
  const MODEL_URL = 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-6.7b-instruct';
  
  // Format prompt for DeepSeek Coder
  const prompt = `<｜begin▁of▁sentence｜>
I need you to fix bugs in the following ${language} code. Only return the corrected code with no explanations.

\`\`\`${language}
${code}
\`\`\`

Fixed code:
\`\`\`${language}`;

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
    
    // If the response contains the closing code fence, remove it
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
