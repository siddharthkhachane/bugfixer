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

    // Call the Hugging Face API to fix the code
    const result = await fixCode(code, language);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fixing code:', error);
    return res.status(500).json({ 
      error: 'Failed to fix code. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
