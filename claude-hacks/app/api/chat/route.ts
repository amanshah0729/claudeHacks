import { NextRequest, NextResponse } from 'next/server';

// More sophisticated response generation based on context
function generateResponse(messages: any[]): string {
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";
  
  // Get conversation context (last few messages)
  const recentMessages = messages.slice(-4);
  const conversationContext = recentMessages.map(m => `${m.role}: ${m.content}`).join("\n");
  
  // Check for specific coding challenges
  const isFibonacciChallenge = conversationContext.toLowerCase().includes('fibonacci');
  const isPalindromeChallenge = conversationContext.toLowerCase().includes('palindrome');
  const isMaxValueChallenge = conversationContext.toLowerCase().includes('maximum value') || 
                             conversationContext.toLowerCase().includes('find_max');
  
  // Determine user's intent
  const isAskingForHelp = lastUserMessage.toLowerCase().includes('help') || 
                          lastUserMessage.toLowerCase().includes('stuck') ||
                          lastUserMessage.toLowerCase().includes('how');
  const isAskingForHint = lastUserMessage.toLowerCase().includes('hint');
  const isGreeting = lastUserMessage.toLowerCase().includes('hello') || 
                     lastUserMessage.toLowerCase().includes('hi');
  const isAskingForSolution = lastUserMessage.toLowerCase().includes('solution') || 
                             lastUserMessage.toLowerCase().includes('answer') ||
                             lastUserMessage.toLowerCase().includes('solve');
  const isAskingForExplanation = lastUserMessage.toLowerCase().includes('explain') || 
                                lastUserMessage.toLowerCase().includes('why') ||
                                lastUserMessage.toLowerCase().includes('how does');
  
  // Generate appropriate response based on context and intent
  if (isGreeting) {
    return "Hello! I'm Claude, your coding assistant. I'm here to help with your coding challenge. What specific part are you having trouble with?";
  }
  
  if (isFibonacciChallenge) {
    if (isAskingForHint) {
      return "Here's a hint for the Fibonacci challenge: Think about using two variables to keep track of the previous two numbers in the sequence. For each step, calculate the next number by adding these two variables, then update them for the next iteration.";
    } else if (isAskingForSolution) {
      return "I can guide you toward a solution without giving it away completely. For Fibonacci, you need to handle the base cases (n=0 and n=1) separately, then use a loop or recursion to calculate each subsequent number. Would you like me to help you implement a specific approach?";
    } else if (isAskingForExplanation) {
      return "The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones. So the sequence goes: 0, 1, 1, 2, 3, 5, 8, 13, and so on. The function needs to return the nth number in this sequence.";
    } else if (isAskingForHelp) {
      return "For the Fibonacci challenge, you need to implement a function that returns the nth Fibonacci number. Would you like help with the recursive approach, the iterative approach, or are you stuck on a specific part of the implementation?";
    }
  }
  
  if (isPalindromeChallenge) {
    if (isAskingForHint) {
      return "Here's a hint for checking palindromes: You can compare characters from both ends of the string, moving inward. Another approach is to reverse the string and compare it with the original.";
    } else if (isAskingForSolution) {
      return "For the palindrome challenge, you could implement it by comparing characters from both ends of the string, or by reversing the string. Would you like me to help you implement one of these approaches?";
    } else if (isAskingForExplanation) {
      return "A palindrome is a string that reads the same backward as forward, like 'racecar' or 'madam'. To check if a string is a palindrome, we need to verify that it reads the same from left to right and from right to left.";
    } else if (isAskingForHelp) {
      return "For the palindrome challenge, you need to check if a string reads the same forward and backward. Are you having trouble with a specific part of the implementation?";
    }
  }
  
  if (isMaxValueChallenge) {
    if (isAskingForHint) {
      return "Here's a hint for finding the maximum value: Initialize a variable with the first element of the list, then iterate through the remaining elements, updating your variable whenever you find a larger value.";
    } else if (isAskingForSolution) {
      return "For finding the maximum value, you can iterate through the list while keeping track of the largest value seen so far. Would you like me to help you implement this approach?";
    } else if (isAskingForExplanation) {
      return "To find the maximum value in a list, we need to compare each element with the current maximum and update it if we find a larger value. This requires a single pass through the list, making it an O(n) operation.";
    } else if (isAskingForHelp) {
      return "For finding the maximum value in a list, you need to track the largest value as you iterate through the elements. Are you having trouble with a specific part of the implementation?";
    }
  }
  
  // If we can't determine a specific response based on context
  if (isAskingForHelp) {
    return "I'd be happy to help! Could you tell me more specifically what you're struggling with in the coding challenge?";
  }
  
  if (isAskingForHint) {
    return "Here's a general hint: Break down the problem into smaller steps. Think about the inputs, the expected outputs, and the transformations needed to get from one to the other. Is there a specific part you're stuck on?";
  }
  
  // Default response
  return "I'm here to help with your coding challenge. Could you provide more details about what you're working on or what specific help you need?";
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    
    // Format messages for Claude API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Call the Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // Using Haiku for faster responses
        max_tokens: 1024,
        messages: formattedMessages,
        system: "You are a helpful coding assistant helping a user with a Python coding challenge. Keep your responses concise and focused on helping the user solve their coding problem without giving away the complete solution. Provide hints, explanations, and guidance rather than full solutions unless explicitly asked."
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API error:", errorData);
      throw new Error(`Claude API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    const data = await response.json();
    
    // Extract Claude's response
    const claudeResponse = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";
    
    return NextResponse.json({ response: claudeResponse });
  } catch (error) {
    console.error("Error in chat API:", error);
    
    // Fallback to mock response if Claude API fails
    return NextResponse.json({ 
      response: "I'm having trouble connecting to my backend. Please try again later or ask a different question.",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 