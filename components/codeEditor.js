import React, { useEffect, useRef } from 'react';

// Simple code editor component that uses a textarea with syntax highlighting
const CodeEditor = ({ code, setCode, language }) => {
  const textareaRef = useRef(null);

  // Handle tab key to insert spaces instead of changing focus
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      // Insert 2 spaces at cursor position
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      
      // Move cursor after the inserted tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="relative w-full h-80 border border-gray-600 rounded-md overflow-hidden">
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-gray-900 text-gray-200"
        placeholder={`Enter your ${language} code here...`}
        spellCheck="false"
      />
    </div>
  );
};

export default CodeEditor;
