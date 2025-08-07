import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CodeBlock from './code-block';
import type { ChatMessage } from '@/lib/types';

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  const [copyFeedback, setCopyFeedback] = useState('');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (error) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const formatContent = (content: string) => {
    // Split content by code blocks
    const parts = content.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const lines = part.slice(3, -3).split('\n');
        const language = lines[0].trim() || 'text';
        const code = lines.slice(1).join('\n');
        
        return (
          <CodeBlock
            key={index}
            code={code}
            language={language}
            filename={`example.${getFileExtension(language)}`}
          />
        );
      } else {
        // Regular text content with markdown-like formatting
        return (
          <div key={index} className="prose prose-invert max-w-none">
            {part.split('\n').map((line, lineIndex) => (
              <p key={lineIndex} className="mb-2 last:mb-0">
                {formatInlineText(line)}
              </p>
            ))}
          </div>
        );
      }
    });
  };

  const formatInlineText = (text: string) => {
    // Handle bold text
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-primary">{part.slice(2, -2)}</strong>;
      }
      // Handle bullet points
      if (part.startsWith('• ')) {
        return <span key={index} className="block ml-4">{part}</span>;
      }
      return part;
    });
  };

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      'c++': 'cpp',
      html: 'html',
      css: 'css',
      json: 'json',
      sql: 'sql',
    };
    return extensions[language.toLowerCase()] || 'txt';
  };

  if (message.role === 'user') {
    return (
      <div className="flex space-x-4 justify-end" data-testid={`message-user-${message.id}`}>
        <div className="flex-1">
          <div className="bg-primary rounded-2xl rounded-tr-md p-4 ml-16">
            <p className="text-white">{message.content}</p>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          <i className="fas fa-user text-white text-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-4" data-testid={`message-assistant-${message.id}`}>
      <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center flex-shrink-0">
        <i className="fas fa-brain text-white text-sm" />
      </div>
      <div className="flex-1">
        <div className="bg-[var(--surface)] rounded-2xl rounded-tl-md p-4 border border-gray-700">
          {message.metadata?.error ? (
            <div className="text-red-400 leading-relaxed">
              <i className="fas fa-exclamation-triangle mr-2" />
              {message.content}
            </div>
          ) : (
            <div className="text-gray-100 leading-relaxed">
              {formatContent(message.content)}
            </div>
          )}
          
          {/* Copy button for the entire message */}
          <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-600">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-md transition-colors"
              data-testid={`button-copy-message-${message.id}`}
            >
              <i className="fas fa-copy mr-1" />
              {copyFeedback || 'Copy'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
