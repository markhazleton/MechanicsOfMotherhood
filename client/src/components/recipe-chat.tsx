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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !session) return;

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
    setInputValue(hint.prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={`recipe-chat ${className}`}>
      <CardHeader className="bg-gradient-to-r from-warm-peach to-warm-cream border-b border-warm-peach/30">
        <div className="flex items-center gap-3">
          <div className="bg-accent-500 text-white p-2.5 rounded-lg">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-display text-brand-800">
              Talk to MoM about this Recipe
            </CardTitle>
            <CardDescription className="text-brand-600">
              Ask about ingredients, servings, substitutions, and more
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-warm-cream/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-accent-500 text-white shadow-md'
                    : 'bg-white text-brand-900 shadow-md border border-warm-peach/30'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <span className="text-xs opacity-70 mt-1 block">
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
              <div className="bg-white text-brand-900 rounded-2xl px-4 py-3 shadow-md border border-warm-peach/30">
                <Loader2 className="h-4 w-4 animate-spin text-accent-500" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Hint Chips */}
        <div className="px-6 py-4 border-t border-warm-peach/30 bg-white/50">
          <p className="text-xs font-semibold text-brand-700 mb-2">
            Quick questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {hints.slice(0, 6).map((hint) => (
              <Badge
                key={hint.id}
                variant="outline"
                className="cursor-pointer hover:bg-accent-50 hover:border-accent-400 transition-all"
                onClick={() => handleHintClick(hint)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleHintClick(hint);
                  }
                }}
              >
                {hint.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-warm-peach/30">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about ingredients, substitutions, tips..."
              className="flex-1 rounded-lg border-warm-peach/50 focus:border-accent-400 focus:ring-accent-400"
              disabled={isLoading}
              aria-label="Chat message input"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="lg"
              variant="accent"
              className="rounded-lg"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Powered by MoM AI (experimental)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
