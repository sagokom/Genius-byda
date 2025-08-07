import { useState } from 'react';
import { useConversations, useChat } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { aiCapabilities } from '@shared/schema';
import type { AICapability } from '@/lib/types';

interface SidebarProps {
  selectedCapability: AICapability;
  onSelectCapability: (capability: AICapability) => void;
  conversationId?: string;
  onSelectConversation: (id: string) => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  selectedCapability,
  onSelectCapability,
  conversationId,
  onSelectConversation,
  onCloseMobile,
}: SidebarProps) {
  const { conversations } = useConversations();
  const { createConversation } = useChat();

  const handleCapabilitySelect = async (capability: AICapability) => {
    onSelectCapability(capability);
    onCloseMobile();
    
    // Create new conversation for this capability
    try {
      const newConversation = await createConversation(
        `New ${capability.name} Chat`,
        capability.id
      );
      onSelectConversation(newConversation.id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/20 text-primary group-hover:bg-primary/30';
      case 'accent':
        return 'bg-accent/20 text-accent group-hover:bg-accent/30';
      case 'yellow-500':
        return 'bg-yellow-500/20 text-yellow-500 group-hover:bg-yellow-500/30';
      case 'pink-500':
        return 'bg-pink-500/20 text-pink-500 group-hover:bg-pink-500/30';
      case 'blue-400':
        return 'bg-blue-400/20 text-blue-400 group-hover:bg-blue-400/30';
      case 'purple-400':
        return 'bg-purple-400/20 text-purple-400 group-hover:bg-purple-400/30';
      case 'emerald-400':
        return 'bg-emerald-400/20 text-emerald-400 group-hover:bg-emerald-400/30';
      default:
        return 'bg-primary/20 text-primary group-hover:bg-primary/30';
    }
  };

  return (
    <>
      {/* Logo and Branding */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
            <i className="fas fa-brain text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white" data-testid="app-title">Byda o.1</h1>
            <p className="text-sm text-gray-400">Next-Gen AI Assistant</p>
          </div>
        </div>
      </div>

      {/* AI Capabilities Categories */}
      <ScrollArea className="flex-1 p-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          AI Capabilities
        </h3>
        
        <div className="space-y-2">
          {aiCapabilities.map((capability) => (
            <Button
              key={capability.id}
              variant="ghost"
              className={`
                capability-card w-full justify-start p-4 h-auto rounded-xl 
                bg-gray-800 hover:bg-gray-750 border border-gray-700 group
                ${selectedCapability.id === capability.id ? 'ring-2 ring-primary' : ''}
              `}
              onClick={() => handleCapabilitySelect(capability)}
              data-testid={`capability-${capability.id}`}
            >
              <div className="flex items-start space-x-3 w-full">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${getColorClasses(capability.color)}`}>
                  <i className={`${capability.icon} text-sm`} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-medium text-white group-hover:text-primary transition-colors">
                    {capability.name}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">
                    {capability.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {capability.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={`px-2 py-1 text-xs ${getColorClasses(capability.color)} border-none`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Self-Improvement Section */}
        <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
          <div className="flex items-center space-x-2 mb-3">
            <i className="fas fa-sync-alt text-primary" />
            <h4 className="font-semibold text-white">Self-Enhancement</h4>
          </div>
          <p className="text-sm text-gray-300 mb-3">Auto-updates, bug fixes & self-optimization</p>
          <div className="flex items-center space-x-2 text-xs text-accent">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>Continuously learning</span>
          </div>
        </div>
      </ScrollArea>

      {/* Status Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full" />
            <span className="text-gray-400">Online</span>
          </div>
          <span className="text-gray-500">v0.1 Beta</span>
        </div>
      </div>
    </>
  );
}
