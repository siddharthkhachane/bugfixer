/**
 * Utility to interact with Hugging Face Inference API - Focused on code fixing
 */
export async function fixCode(code, language) {
  const HF_TOKEN = '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';
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (HF_TOKEN) {
    headers['Authorization'] = `Bearer ${HF_TOKEN}`;
  }

  const MODEL_URL = 'https://api-inference.huggingface.co/models/bigcode/starcoder';
  
  // Very explicit prompt to get exactly what we want
  const prompt = `I have this ${language} code that may have errors. Please fix ONLY the errors in this exact code and return the complete fixed version of the SAME code. Do not create additional functions or explanations.

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
          top_p: 0.95,
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
    
    // Simple post-processing to clean up common issues
    fixedCode = fixedCode
      // Remove Python-style comment lines
      .replace(/^#.*$/gm, '')
      // Remove explanatory text that might appear at the end
      .replace(/^(Here's|This|The).*$/gm, '')
      .trim();
    
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
