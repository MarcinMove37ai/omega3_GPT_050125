import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY in environment variables');
    return NextResponse.json(
      { error: 'Configuration error' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Przekazujemy system prompt jako osobny parametr
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: 'Jesteś asystentem specjalizującym się w analizie badań klinicznych dotyczących kwasów omega-3. Odpowiadasz na pytania w oparciu o dostępne badania naukowe. Twoje odpowiedzi są rzeczowe i oparte na faktach. BARDZO WAŻNE!: Jeżeli pytanie nie dotyczy bezpośrednio wpływu omega na ludzkie zdrowie, uprzejmie odmów odpowiedzi',
      messages: [
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({
      response: response.content[0].text,
      sources: []
    });

  } catch (error) {
    console.error('Error processing request:', error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: 'Error communicating with AI model' },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


