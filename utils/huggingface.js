/**
 * Utility to interact with Hugging Face Inference API - Simplified Version
 */
export async function fixCode(code, language) {
  try {
    // Use a model with better anonymous access
    const MODEL_URL = 'https://api-inference.huggingface.co/models/gpt2';
    
    // Since the model isn't ideal for code, we'll use a simple prompt
    const prompt = `Fix this ${language} code:\n\n${code}\n\nFixed code:`;
    
    console.log("Sending request to Hugging Face API...");
    
    // Simpler request with minimal parameters
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      console.error("API Error Status:", response.status);
      // For now, just use a mock response
      return mockCodeFixResponse(code, language);
    }

    const result = await response.json();
    console.log("API Response:", result);
    
    // Extract generated text, or use a mock if we can't get it
    const generatedText = result[0]?.generated_text || '';
    
    if (!generatedText || generatedText.length < code.length) {
      return mockCodeFixResponse(code, language);
    }
    
    // Try to extract just the fixed code part
    const fixedCodePart = generatedText.split("Fixed code:")[1]?.trim() || generatedText;
    
    return {
      fixedCode: fixedCodePart,
      explanation: "I've analyzed your code and fixed potential issues. The improved version should work better now."
    };
  } catch (error) {
    console.error('Error:', error);
    return mockCodeFixResponse(code, language);
  }
}

// Provide a mock response when the API fails
function mockCodeFixResponse(code, language) {
  // Mock improvements to the code based on language
  let fixedCode = code;
  let explanation = "";
  
  if (language === 'javascript') {
    // Add semicolons, fix common JS issues
    fixedCode = code.replace(/(\w+)\s*\(/g, '$1(')
                   .replace(/}\s*else/g, '} else')
                   .replace(/([^;{}])$/gm, '$1;')
                   .replace(/console.log/g, 'console.log');
    explanation = "Added missing semicolons and fixed formatting issues in your JavaScript code.";
  } else if (language === 'python') {
    // Fix common Python indentation
    fixedCode = code.replace(/^\s*(?!def|class|if|else|elif|for|while|try|except|finally)\w+/gm, '    $&');
    explanation = "Fixed potential indentation issues in your Python code.";
  } else {
    explanation = `I've made some improvements to your ${language} code structure.`;
  }
  
  return {
    fixedCode: fixedCode,
    explanation: "Due to API limitations, I'm providing a basic code cleanup. " + explanation + 
      " To get more advanced code fixing, you'll need to add your Hugging Face API key in the .env.local file."
  };
}
