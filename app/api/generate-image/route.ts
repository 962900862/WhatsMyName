export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { newClient } from '@/aisdk/kling/image-generation';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const client = await newClient();
    const result = await client.createTask({ prompt });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
