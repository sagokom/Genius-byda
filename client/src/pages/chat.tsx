import { useState } from 'react';
import Sidebar from '../components/sidebar';
import ChatInterface from '../components/chat-interface';
import { aiCapabilities } from '@shared/schema';
import type { AICapability } from '@/lib/types';

export default function ChatPage() {
  const [selectedCapability, setSelectedCapability] = useState<AICapability>(aiCapabilities[0]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--dark)]">
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
          data-testid="mobile-overlay"
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-80 bg-[var(--surface)] border-r border-gray-700 flex flex-col
        lg:relative lg:translate-x-0 
        ${isMobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50 translate-x-0' : 'fixed inset-y-0 left-0 z-50 -translate-x-full'}
        lg:z-auto transition-transform duration-300
      `}>
        <Sidebar
          selectedCapability={selectedCapability}
          onSelectCapability={setSelectedCapability}
          conversationId={conversationId}
          onSelectConversation={setConversationId}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatInterface
          selectedCapability={selectedCapability}
          conversationId={conversationId}
          onConversationCreated={setConversationId}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
      </div>
    </div>
  );
}
