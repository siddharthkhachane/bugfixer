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

    // Use DeepSeek Coder to fix the code
    const result = await fixCode(code, language);
    
    // Return the fixed code
    return res.status(200).json({
      fixedCode: result.fixedCode,
      explanation: ""
    });
  } catch (error) {
    console.error('Error fixing code:', error);
    
    // Return original code if there's an error
    return res.status(200).json({ 
      fixedCode: req.body.code || "",
      explanation: ""
    });
  }
}
