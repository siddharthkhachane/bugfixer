import React from 'react';

const ResultsPanel = ({ fixedCode, language, isLoading }) => {
  // Function to copy code to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">Fixed Code</h2>

      {isLoading ? (
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : fixedCode ? (
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute top-2 right-2">
              <button
                onClick={() => copyToClipboard(fixedCode)}
                className="bg-gray-700 hover:bg-gray-600 p-1 rounded-md"
                title="Copy code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
              </button>
            </div>
            <div className="overflow-auto max-h-80 p-4 bg-gray-900 border border-gray-700 rounded-md font-mono text-sm whitespace-pre text-gray-200">
              {fixedCode}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M6 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
          </svg>
          <p className="mt-4">Your fixed code will appear here</p>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
