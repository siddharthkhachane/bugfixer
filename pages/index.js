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
  const [useAI, setUseAI] = useState(false);

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
        body: JSON.stringify({ code, language, useAI }),
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white relative">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-5" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, rgba(66, 153, 225, 0.5) 1px, transparent 1px)', 
               backgroundSize: '28px 28px' 
             }}>
        </div>
      </div>

      <Head>
        <title>BugFixer - AI Code Debugging Tool</title>
        <meta name="description" content="Fix your code bugs with AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-10 px-4 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-400">BugFixer</h1>
        <p className="text-center text-gray-400 mb-8">Powered by AI - Fix your code in seconds</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 backdrop-filter backdrop-blur-sm bg-opacity-80">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-blue-300">Your Code</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <label htmlFor="aiToggle" className="mr-2 text-sm text-gray-400">
                    {useAI ? "AI Mode (Slower)" : "Fast Mode"}
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      id="aiToggle"
                      checked={useAI}
                      onChange={() => setUseAI(!useAI)}
                      className="sr-only"
                    />
                    <div className={`block h-6 rounded-full w-10 ${useAI ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useAI ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </div>
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
            </div>
            
            <CodeEditor code={code} setCode={setCode} language={language} />
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (useAI ? 'AI Fixing (may take 30s+)...' : 'Fixing...') : 'Fix My Code'}
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
      
      <footer className="text-center py-6 text-gray-500 relative z-10">
        Fix bugs faster with advanced AI technology
      </footer>
    </div>
  );
}
