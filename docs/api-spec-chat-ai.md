# Chat AI API Specification

## Overview
RESTful API for the "Talk to MoM about this Recipe" conversational AI feature. Enables users to ask questions about recipes and receive intelligent, contextual responses.

**Base URL:** `https://api.mechanicsofmotherhood.com/v1`

**Authentication:** Bearer token via `Authorization` header

---

## Endpoints

### 1. Initialize Chat Session

**POST** `/recipes/{recipeId}/chat/sessions`

Creates a new chat session for a specific recipe.

#### Request

**Path Parameters:**
- `recipeId` (integer, required) - The unique identifier of the recipe

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "string (optional)",
  "sessionMetadata": {
    "userAgent": "string (optional)",
    "deviceType": "mobile|desktop|tablet (optional)",
    "referrer": "string (optional)"
  }
}
```

#### Response

**Success (201 Created)**
```json
{
  "sessionId": "sess_7x9k2m4n8p1q",
  "recipeId": 42,
  "recipeName": "Classic Chocolate Chip Cookies",
  "status": "active",
  "createdAt": "2025-01-14T20:30:00Z",
  "expiresAt": "2025-01-14T22:30:00Z",
  "welcomeMessage": {
    "id": "msg_abc123xyz",
    "role": "assistant",
    "content": "Hi! I'm MoM — your cooking companion for Classic Chocolate Chip Cookies. I can help you with ingredient swaps, serving adjustments, prep shortcuts, or anything else!",
    "timestamp": "2025-01-14T20:30:00Z",
    "metadata": {
      "type": "welcome"
    }
  },
  "hints": [
    {
      "id": "hint_adjust_servings",
      "label": "Adjust servings",
      "prompt": "How can I adjust this recipe for a different number of servings?",
      "category": "adjustment",
      "priority": 1
    },
    {
      "id": "hint_ingredient_swap",
      "label": "Ingredient swap",
      "prompt": "What can I substitute for ingredients I don't have?",
      "category": "substitution",
      "priority": 2
    }
  ],
  "recipeContext": {
    "ingredients": ["2 cups flour", "1 cup sugar", "..."],
    "servings": 24,
    "prepTime": "15 minutes",
    "cookTime": "12 minutes",
    "difficulty": "easy",
    "category": "Dessert"
  }
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": {
    "code": "INVALID_RECIPE_ID",
    "message": "The provided recipe ID is invalid",
    "timestamp": "2025-01-14T20:30:00Z"
  }
}

// 404 Not Found
{
  "error": {
    "code": "RECIPE_NOT_FOUND",
    "message": "Recipe with ID 42 not found",
    "timestamp": "2025-01-14T20:30:00Z"
  }
}

// 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Maximum chat sessions exceeded. Please try again later.",
    "retryAfter": 3600,
    "timestamp": "2025-01-14T20:30:00Z"
  }
}
```

---

### 2. Send Chat Message

**POST** `/chat/sessions/{sessionId}/messages`

Sends a user message and receives an AI-generated response.

#### Request

**Path Parameters:**
- `sessionId` (string, required) - The unique session identifier

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Can I use honey instead of sugar?",
  "messageMetadata": {
    "clientTimestamp": "2025-01-14T20:31:00Z",
    "language": "en-US (optional)",
    "urgency": "normal|high (optional, default: normal)"
  }
}
```

#### Response

**Success (200 OK)**
```json
{
  "sessionId": "sess_7x9k2m4n8p1q",
  "messages": [
    {
      "id": "msg_user_456",
      "role": "user",
      "content": "Can I use honey instead of sugar?",
      "timestamp": "2025-01-14T20:31:00Z",
      "status": "delivered"
    },
    {
      "id": "msg_asst_789",
      "role": "assistant",
      "content": "Absolutely! You can substitute honey for sugar in this recipe. Use ¾ cup of honey for every 1 cup of sugar, and reduce the liquid in the recipe by 3 tablespoons per cup of honey used. Also, lower your oven temperature by 25°F as honey browns faster than sugar. The cookies will be slightly chewier with a subtle honey flavor.",
      "timestamp": "2025-01-14T20:31:02Z",
      "status": "delivered",
      "metadata": {
        "confidence": 0.95,
        "tokensUsed": 87,
        "responseTime": 2.14,
        "sources": ["recipe_context", "ingredient_substitution_db"]
      }
    }
  ],
  "hints": [
    {
      "id": "hint_related_1",
      "label": "Other sweeteners",
      "prompt": "What other sweeteners can I use besides honey?",
      "category": "substitution",
      "priority": 1
    },
    {
      "id": "hint_related_2",
      "label": "Baking time adjustment",
      "prompt": "Do I need to change the baking time?",
      "category": "technique",
      "priority": 2
    }
  ],
  "conversationState": {
    "messageCount": 2,
    "remainingMessages": 48,
    "topics": ["ingredient_substitution", "sweeteners"]
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Empty message
{
  "error": {
    "code": "EMPTY_MESSAGE",
    "message": "Message content cannot be empty",
    "timestamp": "2025-01-14T20:31:00Z"
  }
}

// 404 Not Found - Session not found
{
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "Chat session not found or expired",
    "timestamp": "2025-01-14T20:31:00Z"
  }
}

// 413 Payload Too Large
{
  "error": {
    "code": "MESSAGE_TOO_LONG",
    "message": "Message exceeds maximum length of 2000 characters",
    "maxLength": 2000,
    "timestamp": "2025-01-14T20:31:00Z"
  }
}

// 503 Service Unavailable
{
  "error": {
    "code": "AI_SERVICE_UNAVAILABLE",
    "message": "AI service temporarily unavailable. Please try again.",
    "timestamp": "2025-01-14T20:31:00Z"
  }
}
```

---

### 3. Get Chat Session

**GET** `/chat/sessions/{sessionId}`

Retrieves the complete chat session history.

#### Request

**Path Parameters:**
- `sessionId` (string, required) - The unique session identifier

**Query Parameters:**
- `limit` (integer, optional, default: 50) - Maximum number of messages to return
- `offset` (integer, optional, default: 0) - Number of messages to skip
- `order` (string, optional, default: "asc") - Sort order: "asc" or "desc"

**Headers:**
```
Authorization: Bearer {token}
```

#### Response

**Success (200 OK)**
```json
{
  "sessionId": "sess_7x9k2m4n8p1q",
  "recipeId": 42,
  "recipeName": "Classic Chocolate Chip Cookies",
  "status": "active",
  "createdAt": "2025-01-14T20:30:00Z",
  "updatedAt": "2025-01-14T20:35:00Z",
  "expiresAt": "2025-01-14T22:30:00Z",
  "messages": [
    {
      "id": "msg_abc123xyz",
      "role": "assistant",
      "content": "Hi! I'm MoM — your cooking companion...",
      "timestamp": "2025-01-14T20:30:00Z"
    },
    {
      "id": "msg_user_456",
      "role": "user",
      "content": "Can I use honey instead of sugar?",
      "timestamp": "2025-01-14T20:31:00Z"
    },
    {
      "id": "msg_asst_789",
      "role": "assistant",
      "content": "Absolutely! You can substitute honey...",
      "timestamp": "2025-01-14T20:31:02Z"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "statistics": {
    "totalMessages": 3,
    "userMessages": 1,
    "assistantMessages": 2,
    "averageResponseTime": 2.14,
    "topicsDiscussed": ["ingredient_substitution", "sweeteners"]
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "Chat session not found",
    "timestamp": "2025-01-14T20:35:00Z"
  }
}
```

---

### 4. Get Available Hints

**GET** `/recipes/{recipeId}/chat/hints`

Retrieves context-aware hint suggestions for a recipe.

#### Request

**Path Parameters:**
- `recipeId` (integer, required) - The unique identifier of the recipe

**Query Parameters:**
- `category` (string, optional) - Filter by category: "adjustment", "substitution", "technique", "planning"
- `limit` (integer, optional, default: 6) - Maximum hints to return

**Headers:**
```
Authorization: Bearer {token}
```

#### Response

**Success (200 OK)**
```json
{
  "recipeId": 42,
  "hints": [
    {
      "id": "hint_adjust_servings",
      "label": "Adjust servings",
      "prompt": "How can I adjust this recipe for a different number of servings?",
      "category": "adjustment",
      "priority": 1,
      "icon": "users"
    },
    {
      "id": "hint_ingredient_swap",
      "label": "Ingredient swap",
      "prompt": "What can I substitute for ingredients I don't have?",
      "category": "substitution",
      "priority": 2,
      "icon": "refresh-cw"
    },
    {
      "id": "hint_kid_friendly",
      "label": "Make it kid-friendlier",
      "prompt": "How can I make this recipe more appealing to kids?",
      "category": "adjustment",
      "priority": 3,
      "icon": "smile"
    },
    {
      "id": "hint_make_ahead",
      "label": "Make ahead tips",
      "prompt": "Can I make any of this ahead of time?",
      "category": "planning",
      "priority": 4,
      "icon": "calendar"
    }
  ],
  "total": 4
}
```

---

### 5. End Chat Session

**DELETE** `/chat/sessions/{sessionId}`

Explicitly ends a chat session and clears conversation history.

#### Request

**Path Parameters:**
- `sessionId` (string, required) - The unique session identifier

**Headers:**
```
Authorization: Bearer {token}
```

#### Response

**Success (204 No Content)**

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "Chat session not found",
    "timestamp": "2025-01-14T20:40:00Z"
  }
}
```

---

### 6. Rate Chat Response

**POST** `/chat/sessions/{sessionId}/messages/{messageId}/rating`

Allows users to rate the quality of an AI response.

#### Request

**Path Parameters:**
- `sessionId` (string, required) - The unique session identifier
- `messageId` (string, required) - The message to rate

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 5,
  "feedback": "Very helpful! Exactly what I needed to know.",
  "categories": ["accurate", "helpful", "clear"]
}
```

**Fields:**
- `rating` (integer, required) - Rating from 1 to 5
- `feedback` (string, optional) - User feedback text (max 500 chars)
- `categories` (array, optional) - Predefined feedback categories: ["accurate", "helpful", "clear", "creative", "too_long", "irrelevant"]

#### Response

**Success (200 OK)**
```json
{
  "messageId": "msg_asst_789",
  "rating": 5,
  "feedback": "Very helpful! Exactly what I needed to know.",
  "categories": ["accurate", "helpful", "clear"],
  "timestamp": "2025-01-14T20:42:00Z",
  "acknowledged": true
}
```

---

## Data Models

### ChatSession
```typescript
{
  sessionId: string;           // Unique identifier
  recipeId: number;           // Associated recipe
  recipeName: string;         // Recipe name for context
  status: "active" | "expired" | "ended";
  createdAt: string;          // ISO 8601 timestamp
  updatedAt: string;          // ISO 8601 timestamp
  expiresAt: string;          // ISO 8601 timestamp (2 hours default)
  userId?: string;            // Optional user identifier
  messageCount: number;       // Total messages in session
}
```

### ChatMessage
```typescript
{
  id: string;                 // Unique message identifier
  role: "user" | "assistant" | "system";
  content: string;            // Message text
  timestamp: string;          // ISO 8601 timestamp
  status: "pending" | "delivered" | "failed";
  metadata?: {
    confidence?: number;      // AI confidence (0-1)
    tokensUsed?: number;     // Tokens consumed
    responseTime?: number;   // Response time in seconds
    sources?: string[];      // Information sources used
  };
}
```

### ChatHint
```typescript
{
  id: string;                 // Unique hint identifier
  label: string;              // Display label
  prompt: string;             // Full prompt text
  category: "adjustment" | "substitution" | "technique" | "planning";
  priority: number;           // Display priority (1 = highest)
  icon?: string;              // Optional icon name
}
```

---

## Rate Limits

| Endpoint | Rate Limit | Window |
|----------|-----------|---------|
| POST /recipes/{id}/chat/sessions | 10 requests | per hour |
| POST /chat/sessions/{id}/messages | 50 requests | per hour |
| GET /chat/sessions/{id} | 100 requests | per hour |
| GET /recipes/{id}/chat/hints | 100 requests | per hour |

---

## Authentication

All endpoints require a valid Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Acquisition:**
- Obtained via user authentication flow (not covered in this spec)
- Tokens expire after 24 hours
- Include user ID and permissions

---

## Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| INVALID_RECIPE_ID | 400 | Recipe ID format is invalid |
| EMPTY_MESSAGE | 400 | Message content is empty |
| MESSAGE_TOO_LONG | 413 | Message exceeds max length |
| RECIPE_NOT_FOUND | 404 | Recipe does not exist |
| SESSION_NOT_FOUND | 404 | Chat session not found or expired |
| UNAUTHORIZED | 401 | Invalid or missing token |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| AI_SERVICE_UNAVAILABLE | 503 | AI service is down |
| INTERNAL_SERVER_ERROR | 500 | Unexpected server error |

---

## Webhooks (Optional)

For real-time streaming responses, implement WebSocket connection:

**WebSocket URL:** `wss://api.mechanicsofmotherhood.com/v1/chat/sessions/{sessionId}/stream`

**Message Format:**
```json
{
  "type": "message_chunk" | "message_complete" | "error",
  "data": {
    "messageId": "msg_asst_789",
    "content": "Absolutely! You can substitute...",
    "done": false
  }
}
```

---

## Best Practices

1. **Session Management**
   - Always store `sessionId` client-side for continuing conversations
   - Sessions expire after 2 hours of inactivity
   - Create new sessions for different recipes

2. **Error Handling**
   - Implement exponential backoff for rate limit errors
   - Show user-friendly error messages
   - Cache hints to reduce API calls

3. **Performance**
   - Fetch hints once per recipe
   - Implement optimistic UI updates for messages
   - Consider WebSocket for streaming responses

4. **Privacy**
   - Do not store sensitive information in messages
   - Sessions are automatically purged after 7 days
   - Users can delete sessions explicitly

---

## Example Implementation Flow

```javascript
// 1. Initialize session when user opens chat
const initResponse = await fetch('/api/v1/recipes/42/chat/sessions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ userId: 'user123' })
});
const session = await initResponse.json();
const sessionId = session.sessionId;

// 2. Display welcome message and hints
displayMessage(session.welcomeMessage);
displayHints(session.hints);

// 3. Send user message
const messageResponse = await fetch(`/api/v1/chat/sessions/${sessionId}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Can I use honey instead of sugar?'
  })
});
const result = await messageResponse.json();
displayMessages(result.messages);

// 4. Rate the response (optional)
await fetch(`/api/v1/chat/sessions/${sessionId}/messages/${messageId}/rating`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    rating: 5,
    feedback: 'Very helpful!'
  })
});
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-14 | Initial specification |

---

## Support

For API support, contact: api-support@mechanicsofmotherhood.com
