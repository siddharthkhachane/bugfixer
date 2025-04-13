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
    
    // Always return 200 status even if there was an error
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fixing code:', error);
    
    // Return a user-friendly error
    return res.status(200).json({ 
      fixedCode: req.body.code || "// Error occurred",
      explanation: "There was a problem connecting to the code fixing service. Please try again later."
    });
  }
}
