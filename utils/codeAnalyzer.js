/**
 * Local code analyzer/fixer that works without any external APIs
 */

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

// Find syntax errors or common bugs in the code
function findSyntaxErrors(code, language) {
  const errors = [];
  
  // Check for unclosed brackets/parentheses
  const openChars = {'(': ')', '{': '}', '[': ']'};
  const stack = [];
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    
    if (Object.keys(openChars).includes(char)) {
      stack.push({char, index: i});
    } else if (Object.values(openChars).includes(char)) {
      const expectedClose = char;
      const lastOpen = stack.pop();
      
      if (!lastOpen || openChars[lastOpen.char] !== expectedClose) {
        errors.push({
          line: code.substring(0, i).split('\n').length,
          message: `Mismatched bracket/parenthesis at position ${i}: found '${char}'`
        });
      }
    }
  }
  
  // Check for any unclosed brackets/parentheses
  while (stack.length > 0) {
    const unclosed = stack.pop();
    errors.push({
      line: code.substring(0, unclosed.index).split('\n').length,
      message: `Unclosed '${unclosed.char}' at position ${unclosed.index}`
    });
  }
  
  // Language-specific checks
  if (language === 'javascript') {
    // Check for missing semicolons
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length > 0 && 
          !line.endsWith(';') && 
          !line.endsWith('{') && 
          !line.endsWith('}') &&
          !line.startsWith('//') &&
          !line.match(/^(if|for|while|function|else|switch|case|default|try|catch)\s*/) &&
          !line.match(/^import\s+/)) {
        errors.push({
          line: i + 1,
          message: 'Missing semicolon at the end of the line'
        });
      }
    }
  }
  
  return errors;
}

// Main function to analyze and fix code
export function analyzeAndFixCode(code, language) {
  // Default to JavaScript if language not specified
  language = language.toLowerCase() || 'javascript';
  
  // Find syntax errors
  const syntaxErrors = findSyntaxErrors(code, language);
  
  // Apply common bug fixes
  let fixedCode = code;
  const appliedFixes = [];
  
  if (commonBugs[language]) {
    for (const bug of commonBugs[language]) {
      const originalCode = fixedCode;
      fixedCode = fixedCode.replace(bug.pattern, bug.replacement);
      
      if (originalCode !== fixedCode) {
        appliedFixes.push(bug.description);
      }
    }
  }
  
  // Fix indentation
  const indentedCode = fixIndentation(fixedCode, language);
  if (indentedCode !== fixedCode) {
    appliedFixes.push('Fixed code indentation');
    fixedCode = indentedCode;
  }
  
  // Compose explanation
  let explanation = '';
  
  if (appliedFixes.length > 0) {
    explanation += 'I fixed the following issues:\n';
    explanation += appliedFixes.map(fix => `- ${fix}`).join('\n');
  } else {
    explanation += 'Your code looks good! I didn\'t find any obvious issues to fix.';
  }
  
  if (syntaxErrors.length > 0) {
    explanation += '\n\nPotential syntax errors to check:\n';
    explanation += syntaxErrors.map(error => `- Line ${error.line}: ${error.message}`).join('\n');
  }
  
  return {
    fixedCode,
    explanation
  };
}
