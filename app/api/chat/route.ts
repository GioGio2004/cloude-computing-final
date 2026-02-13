
export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: /api/chat
 * Enhanced with product recommendation intelligence
 * Parses user queries and returns relevant product IDs
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      message, 
      productContext,
      currentPage, 
      scrollPosition, 
      viewportCenter,
      conversationHistory = []
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // Build conversation context
    const conversationContext = conversationHistory
      .map((msg: any) => {
        let text = msg.content;
        // RECONSTRUCT TAGS so the model sees it "did" use them before
        if (msg.role === "assistant" && Array.isArray(msg.products) && msg.products.length > 0) {
           text += ` [PRODUCTS: ${msg.products.join(',')}]`;
        }
        return `${msg.role === "user" ? "User" : "Assistant"}: ${text}`;
      })
      .join("\n");

    // Enhanced system prompt with product intelligence
    const systemPrompt = `You are a helpful and knowledgeable AI assistant for NoirTube, a premium video sharing platform.

IDENTITY:
- You are a friendly, conversational, and intelligent assistant.
- You can help users find videos, discuss content, or answer general questions.
- You are NOT restricted to short answers or specific formats. Be natural and helpful.

INSTRUCTIONS:
- Answer the user's questions naturally and comprehensively.
- If the user asks about products or merchandise, you can use the provided PRODUCT CATALOG to make recommendations.
- If recommending products, you MAY (but are not required to) include the product IDs at the end if relevant: [PRODUCTS: id,id]

PRODUCT CATALOG:
${productContext}

CURRENT USER CONTEXT:
- Page: ${currentPage}
- Scroll Position: ${scrollPosition}px
- Viewport Center: ${JSON.stringify(viewportCenter)}

${conversationContext ? `CONVERSATION HISTORY:\n${conversationContext}\n` : ""}

Respond naturally and helpfully.`;

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt
                },
                {
                  text: `User Query: ${message}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("Gemini API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to get AI response", details: errorData },
        { status: geminiResponse.status }
      );
    }

    const geminiData = await geminiResponse.json();

    // Extract response text
    let aiResponse = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 
                      "I apologize, but I couldn't generate a response. Please try again.";

    // Parse product IDs from response
    let productIds: number[] = [];
    const productMatch = aiResponse.match(/\[PRODUCTS:\s*([0-9,\s]+)\]/);
    
    if (productMatch) {
      // Extract and clean product IDs
      productIds = productMatch[1]
        .split(',')
        .map((id: string) => parseInt(id.trim()))
        .filter((id: number) => !isNaN(id) && id >= 1 && id <= 12);
      
      // Remove the [PRODUCTS: ...] tag from the response
      aiResponse = aiResponse.replace(/\[PRODUCTS:\s*[0-9,\s]+\]/g, '').trim();
    }

    return NextResponse.json({
      response: aiResponse,
      productIds: productIds,
      metadata: {
        model: "gemini-1.5-flash",
        timestamp: new Date().toISOString(),
        tokensUsed: geminiData?.usageMetadata,
        recommendedProducts: productIds.length
      }
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}