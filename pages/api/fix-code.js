import { fixCode } from '../../utils/huggingface';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    console.log(`Processing ${language} code fix request...`);

    // Call the Hugging Face API to fix the code
    const result = await fixCode(code, language);
    
    // Even if there was an error in the API call, we'll return a 200
    // with the error message in the fixedCode field
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fixing code:', error);
    
    // Return a user-friendly error
    return res.status(200).json({ 
      fixedCode: "// Error processing your request",
      explanation: "There was a problem with the code fixing service. This might be due to rate limiting or a temporary service issue. Please try again in a few minutes."
    });
  }
}
