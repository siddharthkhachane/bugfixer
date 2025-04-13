import { analyzeAndFixCode } from '../../utils/codeAnalyzer';

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

    // Use our local code analyzer instead of the external API
    const result = analyzeAndFixCode(code, language);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fixing code:', error);
    
    // Return a user-friendly error
    return res.status(200).json({ 
      fixedCode: code, // Return the original code
      explanation: "There was an error analyzing your code. Please try again with a different code snippet."
    });
  }
}
