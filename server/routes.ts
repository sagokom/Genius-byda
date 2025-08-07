import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { aiService } from "./services/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get user conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      // For demo purposes, we'll use a default user ID
      const userId = req.query.userId as string || "default-user";
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ error: "Invalid conversation data" });
    }
  });

  // Get conversation messages
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getConversationMessages(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send message and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const { content, capability } = req.body;

      // Validate message data
      const userMessage = insertMessageSchema.parse({
        conversationId: id,
        role: "user",
        content,
        metadata: null,
      });

      // Save user message
      await storage.createMessage(userMessage);

      // Get AI response
      const aiResponse = await aiService.generateResponse(content, capability);

      // Save AI response
      const assistantMessage = insertMessageSchema.parse({
        conversationId: id,
        role: "assistant",
        content: aiResponse.content,
        metadata: aiResponse.metadata,
      });

      const savedMessage = await storage.createMessage(assistantMessage);

      // Update conversation timestamp
      await storage.updateConversation(id, { updatedAt: new Date() });

      res.json(savedMessage);
    } catch (error) {
      console.error("Error in message handling:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
