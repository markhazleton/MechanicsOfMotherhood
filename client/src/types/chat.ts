/**
 * TypeScript interfaces for the "Talk to MoM" chat feature
 *
 * This module defines the types for the recipe chat agent system.
 * Currently stubbed for future LLM integration.
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatHint {
  id: string;
  label: string;
  prompt: string;
  category?: 'adjustment' | 'substitution' | 'technique' | 'planning';
}

export interface ChatSession {
  sessionId: string;
  recipeId: number;
  recipeName: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  sessionId?: string;
  recipeId: number;
  recipeName: string;
  message: string;
  context?: {
    ingredients?: string;
    instructions?: string;
    servings?: number;
  };
}

export interface ChatResponse {
  sessionId: string;
  message: ChatMessage;
  hints?: ChatHint[];
}

/**
 * Future API integration interfaces
 * These will be used when connecting to a real LLM backend
 */

export interface AgentInitRequest {
  recipeId: number;
  recipeName: string;
  recipeContext: {
    ingredients: string;
    instructions: string;
    servings?: number;
    category?: string;
  };
}

export interface AgentInitResponse {
  agentId: string;
  conversationId: string;
  hints: string[];
  welcomeMessage?: string;
}

export interface AgentMessageRequest {
  agentId: string;
  conversationId: string;
  message: string;
}

export interface AgentMessageResponse {
  conversationId: string;
  message: string;
  suggestions?: string[];
  timestamp: string;
}
