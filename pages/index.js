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
    <div>
      <Head>
        <title>BugFixer</title>
        <meta name="description" content="Fix your code bugs with AI" />
      </Head>

      <h1>BugFixer</h1>
      <p>Powered by AI - Fix your code in seconds</p>
      
      <div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Your Code</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div>
                <select 
                  id="aiToggle"
                  value={useAI ? "ai" : "fast"}
                  onChange={(e) => setUseAI(e.target.value === "ai")}
                >
                  <option value="fast">Fast Mode</option>
                  <option value="ai">AI Mode (Slower)</option>
                </select>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
          >
            {isLoading ? (useAI ? 'AI Fixing (may take 30s+)...' : 'Fixing...') : 'Fix My Code'}
          </button>
          
          {error && (
            <div className="error">
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
      
      <footer>
        Fix bugs faster with advanced AI technology
      </footer>
    </div>
  );
}
