import { useState } from 'react';
import Head from 'next/head';
import CodeEditor from '../components/CodeEditor';
import ResultsPanel from '../components/ResultsPanel';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [fixedCode, setFixedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter some code to fix');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/fix-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix code');
      }
      
      setFixedCode(data.fixedCode);
      setExplanation(data.explanation);
    } catch (err) {
      setError(err.message);
      setFixedCode('');
      setExplanation('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Head>
        <title>BugFixer - AI Code Debugging Tool</title>
        <meta name="description" content="Fix your code bugs with AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-400">BugFixer</h1>
        <p className="text-center text-gray-400 mb-8">Powered by AI - Fix your code in seconds</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-blue-300">Your Code</h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700 text-white px-3 py-1 border border-gray-600 rounded-md text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="swift">Swift</option>
              </select>
            </div>
            
            <CodeEditor code={code} setCode={setCode} language={language} />
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Fixing...' : 'Fix My Code'}
            </button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-900 text-red-200 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          <ResultsPanel 
            fixedCode={fixedCode} 
            explanation={explanation} 
            language={language}
            isLoading={isLoading}
          />
        </div>
      </main>
      
      <footer className="text-center py-6 text-gray-500">
        Fix bugs faster with advanced AI technology
      </footer>
    </div>
  );
}
