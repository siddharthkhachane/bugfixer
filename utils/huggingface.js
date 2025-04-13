/**
 * Utility to interact with Hugging Face Inference API - Clean output
 */
export async function fixCode(code, language) {
  const HF_TOKEN = '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';
  
  // Headers with authorization
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (HF_TOKEN) {
    headers['Authorization'] = `Bearer ${HF_TOKEN}`;
  }

  // Using StarCoder model which has better anonymous access
  const MODEL_URL = 'https://api-inference.huggingface.co/models/bigcode/starcoder';
  
  // More precise prompt that asks for only clean code with no explanations
  const prompt = `Fix this ${language} code and return ONLY the corrected code with no comments, explanations, notes, or extra text.

${code}`;

  try {
    console.log("Sending request to Hugging Face API...");
    
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.1,
          top_p: 0.95,
          do_sample: true,
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
    const generatedText = result[0]?.generated_text || result.generated_text || '';
    
    // Clean up the response to get just the code
    // This removes any explanatory text, notes, etc.
    let fixedCode = generatedText.trim();
    
    // Remove any common explanation markers
    const markersToRemove = [
      "FIXED CODE:", "CORRECTED CODE:", "SOLUTION:", "OUTPUT:", 
      "Here's the fixed code:", "Here is the fixed code:"
    ];
    
    for (const marker of markersToRemove) {
      if (fixedCode.includes(marker)) {
        fixedCode = fixedCode.split(marker)[1].trim();
      }
    }
    
    // Remove any text that looks like constraints or notes
    const linesToRemove = [
      "NOTE:", "CONSTRAINTS:", "INPUT:", "OUTPUT:", "SAMPLE INPUT:", "SAMPLE OUTPUT:"
    ];
    
    const lines = fixedCode.split('\n');
    const cleanedLines = lines.filter(line => {
      return !linesToRemove.some(marker => line.trim().startsWith(marker));
    });
    
    fixedCode = cleanedLines.join('\n');
    
    // Return just the fixed code without explanation
    return { fixedCode, explanation: "" };
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    
    // Simple fallback
    return {
      fixedCode: code,
      explanation: ""
    };
  }
}
