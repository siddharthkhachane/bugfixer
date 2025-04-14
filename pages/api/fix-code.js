import { fixCode } from '../../utils/hybridFixer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language, useAI } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Convert useAI to boolean - it might come as a string from the frontend
    const useAIMode = useAI === true || useAI === 'true';
    
    console.log(`Processing ${language} code fix request using ${useAIMode ? 'AI' : 'local'} mode...`);

    // Call the hybrid fixer with the useAI flag
    const result = await fixCode(code, language, useAIMode);
    
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
