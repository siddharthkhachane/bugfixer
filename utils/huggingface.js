/**
 * Utility to interact with Hugging Face Inference API - SantaCoder model
 */
export async function fixCode(code, language) {
  // Direct API key
  const HF_TOKEN = "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";
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${HF_TOKEN}`
  };

  // Use SantaCoder - small, fast, and reliable for the free tier
  const MODEL_URL = 'https://api-inference.huggingface.co/models/bigcode/santacoder';
  
  // Language-specific comment style for the prompt
  let commentPrefix = "//";
  if (language === "python") {
    commentPrefix = "#";
  } else if (language === "ruby") {
    commentPrefix = "#";
  } else if (language === "php") {
    commentPrefix = "//";
  }
  
  // Simple prompt with language-specific comments
  const prompt = `${commentPrefix} Fix the bugs in this ${language} code:
${code}

${commentPrefix} Fixed ${language} code:
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
