import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import Message from './message';
import type { AICapability } from '@/lib/types';

interface ChatInterfaceProps {
  selectedCapability: AICapability;
  conversationId?: string;
  onConversationCreated: (id: string) => void;
  onToggleMobileSidebar: () => void;
}

export default function ChatInterface({
  selectedCapability,
  conversationId,
  onConversationCreated,
  onToggleMobileSidebar,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, isTyping, sendMessage, createConversation, sendMessageWithConversationId, isSending } = useChat(conversationId);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const messageContent = input.trim();
    setInput('');

    try {
      // Always create a new conversation for each message to avoid stale IDs
      const newConversation = await createConversation(
        messageContent.slice(0, 50) + (messageContent.length > 50 ? '...' : ''),
        selectedCapability.id
      );
      onConversationCreated(newConversation.id);
      
      // Send message directly with the new conversation ID
      await sendMessageWithConversationId(messageContent, selectedCapability.id, newConversation.id);
    } catch (error) {
      console.error('Failed to create conversation and send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    // This would typically clear the current conversation or create a new one
    window.location.reload();
  };

  return (
    <>
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700"
              onClick={onToggleMobileSidebar}
              data-testid="button-toggle-sidebar"
            >
              <i className="fas fa-bars text-gray-400" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-white" data-testid="text-capability-name">
                {selectedCapability.name}
              </h2>
              <p className="text-sm text-gray-400" data-testid="text-capability-description">
                {selectedCapability.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              onClick={clearChat}
              data-testid="button-clear-chat"
            >
              <i className="fas fa-trash text-sm" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              data-testid="button-export"
            >
              <i className="fas fa-download text-sm" />
            </Button>
            <Button
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-colors"
              data-testid="button-settings"
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* No welcome message - clean interface */}

          {/* Conversation Messages */}
          {conversationId && Array.isArray(messages) && messages.map((message: any) => (
            <div key={message.id} className="chat-message">
              <Message message={message} />
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-message">
              <div className="flex space-x-4">
                <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-brain text-white text-sm" />
                </div>
                <div className="flex-1">
                  <div className="bg-[var(--surface)] rounded-2xl rounded-tl-md p-4 border border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-sm text-gray-400">Byda is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 bg-[var(--surface)] border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask Byda o.1 about ${selectedCapability.name.toLowerCase()} - coding, automation, analysis, or any complex problem...`}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl p-4 pr-16 text-gray-100 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[80px]"
              disabled={isSending}
              data-testid="input-message"
            />
            
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="absolute bottom-4 right-4 w-8 h-8 bg-primary hover:bg-primary/80 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              size="sm"
              data-testid="button-send"
            >
              <i className="fas fa-paper-plane text-white text-sm" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
                data-testid="button-attach"
              >
                <i className="fas fa-paperclip" />
                <span>Attach</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
                data-testid="button-voice"
              >
                <i className="fas fa-microphone" />
                <span>Voice</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
                data-testid="button-code"
              >
                <i className="fas fa-code" />
                <span>Code</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <i className="fas fa-keyboard" />
              <span>Ctrl + Enter to send</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
