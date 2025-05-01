import { NextRequest, NextResponse } from 'next/server';

// Mock Claude API response for demo purposes
function generateMockResponse(userMessage: string): string {
  // Simple responses based on keywords in the user's message
  if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
    return "Hello! I'm Claude, your coding assistant. How can I help you with your coding challenge today?";
  }
  
  if (userMessage.toLowerCase().includes('help')) {
    return "I'd be happy to help! Could you tell me more specifically what you're struggling with in the coding challenge?";
  }
  
  if (userMessage.toLowerCase().includes('hint')) {
    return "Here's a hint: Consider breaking down the problem into smaller steps. For example, if you're working with a list, think about how you would process each element one by one.";
  }
  
  if (userMessage.toLowerCase().includes('fibonacci')) {
    return "The Fibonacci sequence is a series where each number is the sum of the two preceding ones. You can solve it using recursion or iteration. For better performance, an iterative approach with two variables to keep track of the previous two numbers is often more efficient than recursion.";
  }
  
  if (userMessage.toLowerCase().includes('palindrome')) {
    return "A palindrome is a string that reads the same backward as forward. To check if a string is a palindrome, you can compare characters from the beginning and end, moving inward. Another approach is to reverse the string and check if it equals the original.";
  }
  
  if (userMessage.toLowerCase().includes('max') || userMessage.toLowerCase().includes('maximum')) {
    return "To find the maximum value in a list, you can initialize a variable with the first element, then iterate through the list comparing each element with your current maximum, updating it when you find a larger value.";
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
    
    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === "user").pop();
    
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: "No user message found" },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would call the Claude API here
    // For this demo, we'll use a mock response
    const response = generateMockResponse(lastUserMessage.content);
    
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
} 