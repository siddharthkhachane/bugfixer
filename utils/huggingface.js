/**
 * Utility to interact with Hugging Face Inference API
 */
export async function fixCode(code, language) {
  const HF_TOKEN = process.env.HUGGING_FACE_API_KEY;
  
  // If no API key is provided, we'll use anonymous access
  // This has rate limits, but works for demos and testing
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // if (HF_TOKEN) {
  //   headers['Authorization'] = `Bearer ${HF_TOKEN}`;
  // }

  // We'll use CodeLlama for code generation/fixing
  // Free to use with reasonable rate limits
  const MODEL_URL = 'https://api-inference.huggingface.co/models/codellama/CodeLlama-34b-Instruct-hf';
  
  // Construct a prompt for code fixing based on the language
  const prompt = `
You are an expert programmer. Fix the following ${language} code that contains bugs:

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
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 2048,
          temperature: 0.2,
          top_p: 0.95,
          do_sample: true,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to connect to Hugging Face API');
    }

    const result = await response.json();
    
    // Parse the response to extract fixed code and explanation
    const generatedText = result[0]?.generated_text || '';
    
    // Extract the fixed code and explanation
    const fixedCodeMatch = generatedText.match(/FIXED_CODE:\s*```(?:.*?)\n([\s\S]*?)```/);
    const explanationMatch = generatedText.match(/EXPLANATION:\s*([\s\S]*?)(?:$|```)/);
    
    const fixedCode = fixedCodeMatch ? fixedCodeMatch[1].trim() : '';
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    return { fixedCode, explanation };
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    throw error;
  }
}
