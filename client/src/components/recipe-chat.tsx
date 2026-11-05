/**
 * RecipeChat Component - "Talk to MoM about this Recipe"
 *
 * Interactive chat interface for recipe assistance
 * Features:
 * - Message history display
 * - Input field with send button
 * - Hint chips for common questions
 * - Responsive design (desktop card, mobile bottom sheet)
 * - Stubbed responses (ready for LLM integration)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, ChefHat, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { initializeChatSession, sendChatMessage, getChatHints } from '@/api/chat';
import type { ChatMessage, ChatSession, ChatHint } from '@/types/chat';

interface RecipeChatProps {
  recipeId: number;
  recipeName: string;
  recipeIngredients?: string;
  recipeInstructions?: string;
  className?: string;
}

export function RecipeChat({
  recipeId,
  recipeName,
  recipeIngredients,
  recipeInstructions,
  className = '',
}: RecipeChatProps) {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hints] = useState<ChatHint[]>(getChatHints());
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session on mount
  useEffect(() => {
    const initChat = async () => {
      try {
        const newSession = await initializeChatSession(recipeId, recipeName);
        setSession(newSession);
        setMessages(newSession.messages);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initChat();
  }, [recipeId, recipeName]);

  // Auto-scroll to bottom when new messages arrive (only after user interaction)
  useEffect(() => {
    if (hasUserInteracted && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasUserInteracted]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !session) return;

    // Mark that user has interacted with chat
    setHasUserInteracted(true);

    const userMessage: ChatMessage = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    // Optimistically add user message
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        sessionId: session.sessionId,
        recipeId,
        recipeName,
        message: userMessage.content,
        context: {
          ingredients: recipeIngredients,
          instructions: recipeInstructions,
        },
      });

      // Add assistant response
      setMessages((prev) => [...prev, response.message]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally show error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "Sorry, I'm having trouble responding right now. Please try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHintClick = (hint: ChatHint) => {
    setHasUserInteracted(true);
    setInputValue(hint.prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section
      className={`recipe-chat overflow-hidden rounded-lg border border-border bg-card shadow-sm ${className}`}
      aria-labelledby="recipe-chat-heading"
    >
      <div className="flex items-center gap-4 border-b border-border-subtle px-6 py-5 md:px-8">
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
          <ChefHat className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="eyebrow text-xs">Ask MoM</p>
          <h2 id="recipe-chat-heading" className="mt-1 font-display text-xl font-bold text-foreground">
            Talk to MoM about this recipe
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask about ingredients, servings, substitutions, and more.
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 space-y-4 overflow-y-auto bg-muted px-6 py-6 md:px-8" aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 shadow-xs ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-body'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </p>
              <span className="mt-1 block text-xs opacity-75">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-xs">
              <Loader2 className="size-4 animate-spin text-primary-ink" aria-label="MoM is typing" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Hint Chips */}
      <div className="border-t border-border-subtle px-6 py-4 md:px-8">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Quick questions
        </p>
        <div className="flex flex-wrap gap-2">
          {hints.slice(0, 6).map((hint) => (
            <button
              key={hint.id}
              type="button"
              className="rounded-sm border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors duration-[120ms] hover:border-primary hover:text-primary-ink"
              onClick={() => handleHintClick(hint)}
            >
              {hint.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border-subtle px-6 py-5 md:px-8">
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about ingredients, substitutions, tips…"
            className="flex-1"
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="size-11"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send />
            )}
          </Button>
        </div>
        <p className="mt-2.5 text-center text-xs text-muted-foreground">
          Powered by MoM AI (experimental)
        </p>
      </div>
    </section>
  );
}
