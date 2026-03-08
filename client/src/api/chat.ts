/**
 * Chat API Module - Static-first with optional runtime API integration.
 *
 * Default behavior is local/offline responses so static builds (including GitHub Pages)
 * remain fully functional. If `VITE_CHAT_API_BASE_URL` is configured at runtime, chat
 * requests attempt live API calls and gracefully fall back to local responses on failure.
 */

import type {
  ChatRequest,
  ChatResponse,
  ChatMessage,
  ChatHint,
  ChatSession,
} from '@/types/chat';

const CHAT_API_BASE_URL = (import.meta.env.VITE_CHAT_API_BASE_URL || '').trim();
const CHAT_API_TIMEOUT_MS = Number(import.meta.env.VITE_CHAT_API_TIMEOUT_MS || 10000);

interface LiveInitResponse {
  sessionId?: string;
  agentId?: string;
  conversationId?: string;
  welcomeMessage?: string;
  hints?: ChatHint[];
}

interface LiveMessageResponse {
  sessionId?: string;
  conversationId?: string;
  message?: string;
  hints?: ChatHint[];
}

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
 * Generate a local canned response based on the user's message.
 * Used as a default static mode and as fallback when live API is unavailable.
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

function isLiveChatEnabled(): boolean {
  return CHAT_API_BASE_URL.length > 0;
}

async function fetchLiveChat<T>(path: string, payload: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHAT_API_TIMEOUT_MS);

  try {
    const response = await fetch(`${CHAT_API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Chat API error ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function buildFallbackWelcomeMessage(recipeName: string): ChatMessage {
  return {
    id: generateMessageId(),
    role: 'assistant',
    content: `Hi! I'm MoM — your cooking companion for ${recipeName}. I'm still learning, but I can help you tweak this recipe to fit your needs. Ask me about ingredient swaps, serving adjustments, prep shortcuts, or anything else!`,
    timestamp: new Date(),
  };
}

function buildFallbackChatSession(recipeId: number, recipeName: string): ChatSession {
  return {
    sessionId: generateSessionId(),
    recipeId,
    recipeName,
    messages: [buildFallbackWelcomeMessage(recipeName)],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Initialize a new chat session
 */
export async function initializeChatSession(
  recipeId: number,
  recipeName: string
): Promise<ChatSession> {
  if (isLiveChatEnabled()) {
    try {
      const liveResponse = await fetchLiveChat<LiveInitResponse>(
        `/api/recipes/${recipeId}/agent/start`,
        { recipeName }
      );

      const sessionId =
        liveResponse.sessionId ||
        liveResponse.conversationId ||
        liveResponse.agentId ||
        generateSessionId();

      const welcomeMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: liveResponse.welcomeMessage || buildFallbackWelcomeMessage(recipeName).content,
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
    } catch (error) {
      console.warn('Live chat initialization failed; using local fallback.', error);
    }
  }

  // Keep a small delay so UI behavior remains similar in fallback mode.
  await new Promise((resolve) => setTimeout(resolve, 300));
  return buildFallbackChatSession(recipeId, recipeName);
}

/**
 * Send a message to the chat agent
 */
export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  if (isLiveChatEnabled() && request.sessionId) {
    try {
      const liveResponse = await fetchLiveChat<LiveMessageResponse>(
        `/api/agents/${encodeURIComponent(request.sessionId)}/messages`,
        {
          message: request.message,
          recipeId: request.recipeId,
          recipeName: request.recipeName,
          context: request.context,
        }
      );

      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: liveResponse.message || generateStubResponse(request.message, request.recipeName),
        timestamp: new Date(),
      };

      return {
        sessionId:
          liveResponse.sessionId ||
          liveResponse.conversationId ||
          request.sessionId,
        message: assistantMessage,
        hints: liveResponse.hints || DEFAULT_HINTS,
      };
    } catch (error) {
      console.warn('Live chat message failed; using local fallback.', error);
    }
  }

  // Simulate API delay in fallback mode.
  await new Promise((resolve) => setTimeout(resolve, 500));

  const sessionId = request.sessionId || generateSessionId();

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
