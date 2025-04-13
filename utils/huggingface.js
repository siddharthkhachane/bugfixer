/**
 * Utility to interact with Hugging Face Inference API
 */
export async function fixCode(code, language) {
  // Use a simpler model with better anonymous access
  const MODEL_URL = 'https://api-inference.huggingface.co/models/bigcode/starcoder';
  
  // Simplified headers - no authentication
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Construct a prompt for code fixing based on the language
  const prompt = `
Fix the following ${language} code that contains bugs:

\`\`\`${language}
${code}
\`\`\`

Provide the corrected code without any explanations first, then explain what was wrong with the original code and how you fixed it. 
Format your answer as:

FIXED_CODE:
\`\`\`${language}
(your fixed code goes here)
\`\`\`

EXPLANATION:
(your explanation goes here)
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
          temperature: 0.2,
          return_full_text: false,
        }
      }),
    });

    // If there's an error with the API call
    if (!response.ok) {
      // Log more details about the error
      console.error("API Error Status:", response.status);
      try {
        const errorData = await response.json();
        console.error("API Error Details:", errorData);
        
        // Handle anonymous access rate limits
        if (response.status === 429) {
          return {
            fixedCode: "// Could not process due to rate limiting. Please try again in a minute.",
            explanation: "The API is currently rate limited. This happens with anonymous access to Hugging Face. Please try again in a minute or add an API key to your .env.local file."
          };
        }
        
        throw new Error(errorData.error || 'Failed to connect to Hugging Face API');
      } catch (e) {
        throw new Error(`API error (${response.status}): ${e.message}`);
      }
    }

    const result = await response.json();
    console.log("API Response received:", result);
    
    // For debugging
    console.log("Generated Text:", result.generated_text || result[0]?.generated_text);
    
    // Parse the response to extract fixed code and explanation
    const generatedText = result[0]?.generated_text || result.generated_text || '';
    
    // If we couldn't parse the result properly
    if (!generatedText) {
      return {
        fixedCode: "// Sorry, I couldn't process your code properly",
        explanation: "There was an issue with the AI model's response. Please try a shorter code snippet or a different language."
      };
    }
    
    // Extract the fixed code and explanation
    const fixedCodeMatch = generatedText.match(/FIXED_CODE:\s*```(?:.*?)\n([\s\S]*?)```/);
    const explanationMatch = generatedText.match(/EXPLANATION:\s*([\s\S]*?)(?:$|```)/);
    
    const fixedCode = fixedCodeMatch ? fixedCodeMatch[1].trim() : '';
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    // If we couldn't extract the fixed code in the expected format, return the whole response
    if (!fixedCode && generatedText) {
      return {
        fixedCode: generatedText,
        explanation: "The AI model didn't format the response as expected, but here's what it returned."
      };
    }

    return { fixedCode, explanation };
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    
    // Return a user-friendly error as the fixed code
    return {
      fixedCode: "// Error: Couldn't connect to the AI service",
      explanation: "There was a problem connecting to the Hugging Face API. This might be due to rate limiting on anonymous access. You can try again in a few minutes or add your own API key in the .env.local file."
    };
  }
}
