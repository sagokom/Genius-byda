import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export default function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copyFeedback, setCopyFeedback] = useState('');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (error) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const getLanguageIcon = (lang: string): string => {
    const icons: Record<string, string> = {
      javascript: 'fab fa-js-square text-yellow-400',
      typescript: 'fab fa-js-square text-blue-400',
      python: 'fab fa-python text-yellow-400',
      java: 'fab fa-java text-red-400',
      html: 'fab fa-html5 text-orange-400',
      css: 'fab fa-css3-alt text-blue-400',
      react: 'fab fa-react text-blue-400',
      node: 'fab fa-node-js text-green-400',
    };
    return icons[lang.toLowerCase()] || 'fas fa-code text-gray-400';
  };

  return (
    <div className="code-block rounded-xl p-4 my-4" data-testid={`code-block-${language}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <i className={getLanguageIcon(language)} />
          <span className="text-sm font-medium text-gray-300">
            {filename || `${language}.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'txt'}`}
          </span>
        </div>
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size="sm"
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-md transition-colors"
          data-testid={`button-copy-code-${language}`}
        >
          <i className="fas fa-copy mr-1" />
          {copyFeedback || 'Copy'}
        </Button>
      </div>
      <pre className="text-sm text-gray-300 overflow-x-auto">
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
