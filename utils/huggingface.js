export async function fixCode(code, language) {
  const HF_TOKEN ='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';
  
  // Headers with authorization
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (HF_TOKEN) {
    headers['Authorization'] = `Bearer ${HF_TOKEN}`;
  }

  // Using StarCoder model which has better anonymous access
  const MODEL_URL = 'https://api-inference.huggingface.co/models/bigcode/starcoder';
  
  // More directive prompt that explicitly asks for fixing
  const prompt = `You are a code fixing expert. Your task is to fix bugs in the code below.

LANGUAGE: ${language}

BUGGY CODE:
${code}

FIX THE BUGS AND RETURN ONLY THE CORRECTED CODE:
`;

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
    
    // Try to extract just the code part
    let fixedCode = generatedText.trim();
    
    // If the response includes any labels or markers, remove them
    if (fixedCode.includes("CORRECTED CODE:")) {
      fixedCode = fixedCode.split("CORRECTED CODE:")[1].trim();
    }
    
    // Simple explanation
    const explanation = "I've analyzed your code and fixed the bugs. The corrected version should now run properly.";

    return { fixedCode, explanation };
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    
    // Simple fallback analysis in case of API failure
    return {
      fixedCode: code,
      explanation: "Sorry, I couldn't connect to the AI service to fix your code. Please try again later or check your code manually."
    };
  }
}
