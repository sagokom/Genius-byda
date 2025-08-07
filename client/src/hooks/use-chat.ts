import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { ChatMessage, Conversation } from '@/lib/types';

export function useChat(conversationId?: string) {
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();

  // Fetch messages for current conversation
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    enabled: !!conversationId,
    staleTime: 0, // Always refetch
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });



  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, capability }: { content: string; capability: string }) => {
      if (!conversationId) throw new Error('No conversation selected');
      
      setIsTyping(true);
      const response = await apiRequest('POST', `/api/conversations/${conversationId}/messages`, {
        content,
        capability,
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', conversationId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async ({ title, capability }: { title: string; capability: string }) => {
      const response = await apiRequest('POST', '/api/conversations', {
        userId: 'default-user', // For demo purposes
        title,
        capability,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
  });

  const sendMessage = useCallback((content: string, capability: string) => {
    sendMessageMutation.mutate({ content, capability });
  }, [sendMessageMutation]);

  const sendMessageWithConversationId = useCallback(async (content: string, capability: string, convId: string) => {
    setIsTyping(true);
    try {
      const response = await apiRequest('POST', `/api/conversations/${convId}/messages`, {
        content,
        capability,
      });
      
      // Invalidate queries for the specific conversation
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', convId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      setIsTyping(false);
      
      return await response.json();
    } catch (error) {
      setIsTyping(false);
      throw error;
    }
  }, [queryClient]);

  const createConversation = useCallback((title: string, capability: string) => {
    return createConversationMutation.mutateAsync({ title, capability });
  }, [createConversationMutation]);

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    sendMessageWithConversationId,
    createConversation,
    isSending: sendMessageMutation.isPending,
  };
}

export function useConversations() {
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: async () => {
      const response = await fetch('/api/conversations?userId=default-user');
      return response.json();
    },
  });

  return { conversations, isLoading };
}
