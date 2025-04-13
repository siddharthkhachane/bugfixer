export async function fixCode(code, language) {
  const HF_TOKEN = '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';
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (HF_TOKEN) {
    headers['Authorization'] = `Bearer ${HF_TOKEN}`;
  }

  // Use CodeLlama-7b which is better for code tasks
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
      const error = await response.json();
      console.error("API Error Details:", error);
      throw new Error(error.error || 'Failed to connect to Hugging Face API');
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
