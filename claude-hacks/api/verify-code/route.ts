import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code || typeof code !== 'string' || code.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      );
    }
    
    // In a real implementation, you would verify the code against a database
    // For this demo, we're using localStorage on the client side
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 