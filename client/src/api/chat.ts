/**
 * Chat API Module - Stubbed for Future LLM Integration
 *
 * This module provides the interface for the "Talk to MoM about this Recipe" feature.
 * Currently returns canned responses for demonstration purposes.
 *
 * TO INTEGRATE WITH REAL API:
 * 1. Replace stub functions with actual API calls
 * 2. Update API_BASE_URL to your backend endpoint
 * 3. Implement proper error handling and retry logic
 * 4. Add streaming support for real-time responses (optional)
 */

import type {
  ChatRequest,
  ChatResponse,
  ChatMessage,
  ChatHint,
  ChatSession,
} from '@/types/chat';

// TODO: Replace with actual API endpoint when ready
const API_BASE_URL = '/api/chat';

/**
 * Default hint chips for recipe conversations
 */
export const DEFAULT_HINTS: ChatHint[] = [
  {
    id: 'adjust_servings',
    label: 'Adjust servings',
    prompt: 'How can I adjust this recipe for a different number of servings?',
    category: 'adjustment',
  },
  {
    id: 'ingredient_swap',
    label: 'Ingredient swap',
    prompt: 'What can I substitute for ingredients I don\'t have?',
    category: 'substitution',
  },
  {
    id: 'kid_friendly',
    label: 'Make it kid-friendlier',
    prompt: 'How can I make this recipe more appealing to kids?',
    category: 'adjustment',
  },
  {
    id: 'combine_recipe',
    label: 'Combine with another recipe',
    prompt: 'What side dishes or recipes would pair well with this?',
    category: 'planning',
  },
  {
    id: 'prep_shortcuts',
    label: 'Prep shortcuts',
    prompt: 'Are there any shortcuts to make prep faster?',
    category: 'technique',
  },
  {
    id: 'make_ahead',
    label: 'Make ahead tips',
    prompt: 'Can I make any of this ahead of time?',
    category: 'planning',
  },
];

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique message ID
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a canned response based on the user's message
 * TODO: Replace with actual LLM API call
 */
function generateStubResponse(userMessage: string, recipeName: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Pattern matching for common queries
  if (lowerMessage.includes('serving') || lowerMessage.includes('scale')) {
    return `For ${recipeName}, you can easily scale the recipe! Just multiply or divide all ingredients proportionally. For example, to double the recipe, use twice the amount of each ingredient. I can help you calculate exact amounts if you tell me how many servings you need.`;
  }

  if (lowerMessage.includes('substitute') || lowerMessage.includes('swap') || lowerMessage.includes('instead')) {
    return `Great question! For ${recipeName}, I can suggest some substitutions. What specific ingredient are you looking to replace? Common swaps include: using Greek yogurt instead of sour cream, olive oil instead of butter, or honey instead of sugar. Each swap might slightly change the flavor or texture, and I'm here to guide you!`;
  }

  if (lowerMessage.includes('kid') || lowerMessage.includes('child') || lowerMessage.includes('picky')) {
    return `Making ${recipeName} kid-friendly is totally doable! Here are some tips: reduce strong spices, add a touch of sweetness, cut ingredients into fun shapes, and let them help with prep. Kids are more likely to eat what they help make. Would you like specific suggestions for this recipe?`;
  }

  if (lowerMessage.includes('ahead') || lowerMessage.includes('prep') || lowerMessage.includes('advance')) {
    return `Good thinking! For ${recipeName}, you can definitely do some prep ahead. Many ingredients can be chopped, measured, or even partially cooked the night before. I recommend storing prepped ingredients in airtight containers in the fridge. What specific parts are you thinking of preparing in advance?`;
  }

  if (lowerMessage.includes('pair') || lowerMessage.includes('side') || lowerMessage.includes('goes with')) {
    return `${recipeName} pairs wonderfully with several options! Think about complementary flavors and textures. A light salad balances rich dishes, while crusty bread works great with saucy recipes. What's the occasion? I can suggest specific pairings based on your needs.`;
  }

  if (lowerMessage.includes('faster') || lowerMessage.includes('quick') || lowerMessage.includes('shortcut')) {
    return `I hear you—time is precious! For ${recipeName}, here are some shortcuts: use pre-chopped vegetables, a food processor for mincing, or even quality store-bought components for time-intensive parts. The key is balancing convenience with flavor. What's your biggest time constraint?`;
  }

  if (lowerMessage.includes('dietary') || lowerMessage.includes('allerg') || lowerMessage.includes('gluten') || lowerMessage.includes('dairy')) {
    return `I understand dietary needs are important! For ${recipeName}, we can work on modifications. Common swaps include gluten-free flour blends, dairy-free milk alternatives, or egg substitutes. The exact modification depends on the restriction—can you tell me more about your specific dietary need?`;
  }

  if (lowerMessage.includes('store') || lowerMessage.includes('leftover') || lowerMessage.includes('keep')) {
    return `Good question! For ${recipeName}, proper storage extends its life. Most dishes last 3-4 days refrigerated in airtight containers. Some recipes freeze well too. Let me know if you'd like specific storage tips or reheating instructions for this recipe!`;
  }

  // Default response
  return `Thanks for your question about ${recipeName}! I'm here to help you with cooking tips, ingredient substitutions, serving adjustments, and more. While I'm still learning, I can offer practical advice to make your cooking easier. What specific aspect of this recipe would you like help with?`;
}

/**
 * Initialize a new chat session
 * TODO: Replace with actual API endpoint: POST /api/recipes/{id}/agent/start
 */
export async function initializeChatSession(
  recipeId: number,
  recipeName: string
): Promise<ChatSession> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const sessionId = generateSessionId();
  const welcomeMessage: ChatMessage = {
    id: generateMessageId(),
    role: 'assistant',
    content: `Hi! I'm MoM — your cooking companion for ${recipeName}. I'm still learning, but I can help you tweak this recipe to fit your needs. Ask me about ingredient swaps, serving adjustments, prep shortcuts, or anything else!`,
    timestamp: new Date(),
  };

  return {
    sessionId,
    recipeId,
    recipeName,
    messages: [welcomeMessage],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Send a message to the chat agent
 * TODO: Replace with actual API endpoint: POST /api/agents/{agentId}/messages
 */
export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const sessionId = request.sessionId || generateSessionId();

  // Create user message
  const userMessage: ChatMessage = {
    id: generateMessageId(),
    role: 'user',
    content: request.message,
    timestamp: new Date(),
  };

  // Generate stub response
  const responseContent = generateStubResponse(
    request.message,
    request.recipeName
  );

  const assistantMessage: ChatMessage = {
    id: generateMessageId(),
    role: 'assistant',
    content: responseContent,
    timestamp: new Date(),
  };

  return {
    sessionId,
    message: assistantMessage,
    hints: DEFAULT_HINTS,
  };
}

/**
 * Get suggested hints for a recipe
 */
export function getChatHints(): ChatHint[] {
  return DEFAULT_HINTS;
}

/**
 * Future API integration functions
 * Uncomment and implement when connecting to real backend
 */

/*
export async function initializeAgent(
  recipeId: number,
  recipeName: string,
  context: { ingredients: string; instructions: string }
): Promise<AgentInitResponse> {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/agent/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipeName,
      context,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to initialize agent');
  }

  return response.json();
}

export async function sendAgentMessage(
  agentId: string,
  conversationId: string,
  message: string
): Promise<AgentMessageResponse> {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId,
      message,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}
*/
