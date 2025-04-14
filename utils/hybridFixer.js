/**
 * Hybrid code fixer with toggle between fast local mode and AI-powered mode
 */

// Import the AI-based fixer
import { fixCodeWithAI } from './huggingface';

// Common bugs and their fixes per language
const commonBugs = {
  javascript: [
    {
      pattern: /(\w+)\s*\(/g, 
      replacement: '$1(', 
      description: 'Fixed spacing before function calls'
    },
    {
      pattern: /}\s*else/g, 
      replacement: '} else', 
      description: 'Fixed spacing in else statements'
    },
    {
      pattern: /([^;{}])\s*$/gm, 
      replacement: '$1;', 
      description: 'Added missing semicolons'
    },
    {
      pattern: /==/g, 
      replacement: '===', 
      description: 'Replaced == with === for strict equality'
    },
    {
      pattern: /!=/g, 
      replacement: '!==', 
      description: 'Replaced != with !== for strict inequality'
    },
    {
      pattern: /let\s+(\w+)\s*=\s*\[\];?\s*for/g, 
      replacement: 'let $1 = [];\n\nfor', 
      description: 'Added proper spacing after array initialization'
    },
    {
      pattern: /var\s/g, 
      replacement: 'let ', 
      description: 'Replaced var with let for better scoping'
    },
    {
      pattern: /console\.log\s*\(\s*["'].*["']\)/g, 
      replacement: (match) => match.slice(0, -1) + ');', 
      description: 'Added missing closing parenthesis in console.log'
    }
  ],
  python: [
    {
      pattern: /(\s*)def(\s+\w+\s*\([^)]*\))(\s*[^:])/g,
      replacement: '$1def$2:$3',
      description: 'Added missing colon after function definition'
    },
    {
      pattern: /(\s*)(if|elif|else|for|while|try|except|finally|with|def|class)(\s+[^:]*[^:\s])(\s*)$/gm,
      replacement: '$1$2$3:$4',
      description: 'Added missing colon in control structure'
    },
    {
      pattern: /([^,\s])\[/g,
      replacement: '$1 [',
      description: 'Added space before opening bracket'
    },
    {
      pattern: /print\s+([^(])/g,
      replacement: 'print($1)',
      description: 'Fixed print statement to use parentheses (Python 3)'
    },
    {
      pattern: /except\s+(\w+)(\s*[^:])/g,
      replacement: 'except $1:$2',
      description: 'Added missing colon after except statement'
    },
    {
      pattern: /(\s*)return([^\s])/g,
      replacement: '$1return $2',
      description: 'Added space after return keyword'
    }
  ],
  java: [
    {
      pattern: /(\w+)\s*\(/g, 
      replacement: '$1(', 
      description: 'Fixed spacing before method calls'
    },
    {
      pattern: /([^;{}])\s*$/gm, 
      replacement: '$1;', 
      description: 'Added missing semicolons'
    },
    {
      pattern: /public\s+static\s+void\s+Main/g, 
      replacement: 'public static void main', 
      description: 'Fixed main method case (main not Main)'
    },
    {
      pattern: /System\.out\.println\s*\(\s*["'][^"']*["']\s*\)/g,
      replacement: (match) => {
        // Check if the string has quotes and semicolon
        if (!match.endsWith(';') && match.includes('"')) {
          return match + ';';
        }
        return match;
      },
      description: 'Added missing semicolon after println'
    },
    {
      pattern: /System\.out\.print\s*\(\s*["'][^"']*["']\s*\)/g,
      replacement: (match) => {
        // Check if the string has quotes and semicolon
        if (!match.endsWith(';') && match.includes('"')) {
          return match + ';';
        }
        return match;
      },
      description: 'Added missing semicolon after print'
    },
    {
      pattern: /catch\s*\(([^)]+)\)\s*([^{])/g,
      replacement: 'catch ($1) {$2',
      description: 'Added missing opening brace in catch block'
    }
  ],
  cpp: [
    {
      pattern: /#include<([^>]+)>/g,
      replacement: '#include <$1>',
      description: 'Added proper spacing in include directive'
    },
    {
      pattern: /([^;{}])\s*$/gm, 
      replacement: '$1;', 
      description: 'Added missing semicolons'
    },
    {
      pattern: /cout\s*<<\s*(.+?)\s*([^<]|$)/g,
      replacement: 'cout << $1 << $2',
      description: 'Fixed cout syntax'
    },
    {
      pattern: /cin\s*>>\s*(.+?)\s*([^>]|$)/g,
      replacement: 'cin >> $1 >> $2',
      description: 'Fixed cin syntax'
    }
  ],
  csharp: [
    {
      pattern: /Console\.Write\(/g,
      replacement: 'Console.WriteLine(',
      description: 'Changed Write to WriteLine for better output formatting'
    },
    {
      pattern: /([^;{}])\s*$/gm, 
      replacement: '$1;', 
      description: 'Added missing semicolons'
    },
    {
      pattern: /public\s+static\s+void\s+Main/g, 
      replacement: 'public static void Main', 
      description: 'Fixed main method signature'
    }
  ],
  php: [
    {
      pattern: /([^;{}])\s*$/gm, 
      replacement: '$1;', 
      description: 'Added missing semicolons'
    },
    {
      pattern: /\$(\w+)\s*=\s*\$_POST\[([^\]]+)\]/g,
      replacement: '$$$1 = $_POST[$2] ?? null;',
      description: 'Added null check for POST variables'
    },
    {
      pattern: /echo\s+([^;]+)$/gm,
      replacement: 'echo $1;',
      description: 'Added missing semicolon after echo'
    }
  ],
  ruby: [
    {
      pattern: /def\s+(\w+)\s*\(([^)]*)\)/g,
      replacement: 'def $1($2)',
      description: 'Fixed method definition syntax'
    },
    {
      pattern: /puts\s+"([^"]+)"\s*\+\s*(\w+)/g,
      replacement: 'puts "$1#{$2}"',
      description: 'Converted string concatenation to string interpolation'
    }
  ],
  go: [
    {
      pattern: /func\s+(\w+)\s*\(([^)]*)\)(\s*)(\w+)?\s*{/g,
      replacement: 'func $1($2)$3$4 {',
      description: 'Fixed function declaration syntax'
    },
    {
      pattern: /fmt\.Println\(/g,
      replacement: 'fmt.Println(',
      description: 'Fixed print statement'
    }
  ],
  swift: [
    {
      pattern: /print\(/g,
      replacement: 'print(',
      description: 'Fixed print function'
    },
    {
      pattern: /var\s+(\w+)\s*:\s*([A-Z]\w*)\s*;/g,
      replacement: 'var $1: $2',
      description: 'Removed unnecessary semicolon'
    }
  ]
};

// Find and fix indentation issues
function fixIndentation(code, language) {
  if (language === 'python') {
    // Fix Python indentation - make sure blocks are properly indented
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentSize = 4;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trimLeft();
      
      // Check if this line decreases indent (starts with 'else', 'elif', etc.)
      if (line.match(/^(else|elif|except|finally|catch)/)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add proper indentation
      if (line.length > 0 && !line.startsWith('#')) {
        lines[i] = ' '.repeat(indentLevel * indentSize) + line;
      }
      
      // Check if this line increases indent (ends with ':')
      if (line.match(/:\s*$/)) {
        indentLevel++;
      }
    }
    
    return lines.join('\n');
  }
  
  // Basic indentation for JavaScript, Java, etc.
  if (['javascript', 'java', 'cpp', 'csharp'].includes(language)) {
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentSize = 2;
    
    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      
      // Check if this line decreases indent (starts with '}')
      if (trimmedLine.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add proper indentation for non-empty lines
      if (trimmedLine.length > 0) {
        lines[i] = ' '.repeat(indentLevel * indentSize) + trimmedLine;
      }
      
      // Check if this line increases indent (ends with '{')
      if (trimmedLine.endsWith('{')) {
        indentLevel++;
      }
    }
    
    return lines.join('\n');
  }
  
  return code; // No indentation fixes for other languages
}

// Local function to analyze and fix code
async function fixCodeLocally(code, language) {
  // Default to JavaScript if language not specified
  language = language.toLowerCase() || 'javascript';
  
  // Apply common bug fixes
  let fixedCode = code;
  
  if (commonBugs[language]) {
    for (const bug of commonBugs[language]) {
      fixedCode = fixedCode.replace(bug.pattern, bug.replacement);
    }
  }
  
  // Fix indentation
  fixedCode = fixIndentation(fixedCode, language);
  
  // Special case for Java - fix missing quotes/semicolons in println
  if (language === 'java') {
    const lines = fixedCode.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('System.out.print') && !line.endsWith(';')) {
        lines[i] = lines[i] + ';';
      }
      
      // Check for missing quotes in println
      if (line.includes('System.out.println(') && !line.includes('"') && !line.includes("'")) {
        // This likely needs quotes around text
        lines[i] = lines[i].replace(/System\.out\.println\(([^)]*)\)/, 'System.out.println("$1")');
      }
    }
    fixedCode = lines.join('\n');
  }
  
  return { fixedCode, explanation: "" };
}

// Main export function that uses either local or AI fixing based on the useAI parameter
export async function fixCode(code, language, useAI = false) {
  console.log(`Using ${useAI ? 'AI-powered' : 'local'} code fixing...`);
  
  if (useAI) {
    try {
      // Use the AI code fixer (CodeLlama)
      const result = await fixCodeWithAI(code, language);
      return result;
    } catch (error) {
      console.error('Error with AI code fixing, falling back to local:', error);
      // Fall back to local if AI fails
      return await fixCodeLocally(code, language);
    }
  } else {
    // Use the local pattern-based fixer
    return await fixCodeLocally(code, language);
  }
}
