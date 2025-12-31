import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

interface PasteData {
  content: string;
  views: number;
  maxViews?: number;
  expiresAt?: number;
  createdAt: number;
}

const store = globalThis as unknown as {
  pastes?: Map<string, PasteData>;
};

if (!store.pastes) {
  store.pastes = new Map();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const id = nanoid(10);
    const now = Date.now();
    
    const pasteData: PasteData = {
      content,
      views: 0,
      createdAt: now,
    };

    // Add expiration time if TTL is provided
    if (ttl_seconds && ttl_seconds > 0) {
      pasteData.expiresAt = now + (ttl_seconds * 1000);
    }

    // Add max views if provided
    if (max_views && max_views > 0) {
      pasteData.maxViews = max_views;
    }

    store.pastes!.set(id, pasteData);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    return NextResponse.json({
      id,
      url: `${baseUrl}/p/${id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create paste' },
      { status: 500 }
    );
  }
}