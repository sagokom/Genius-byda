export interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tags: readonly string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    capability?: string;
    hasCode?: boolean;
    language?: string;
    error?: boolean;
  };
}

export interface Conversation {
  id: string;
  title: string;
  capability: string;
  createdAt: Date;
  updatedAt: Date;
}
