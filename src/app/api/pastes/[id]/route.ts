import { NextResponse } from 'next/server';

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

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!store.pastes) {
    return NextResponse.json(
      { error: 'Storage not initialized' },
      { status: 500 }
    );
  }
  
  const paste = store.pastes.get(id);

  if (!paste) {
    return NextResponse.json(
      { error: 'Paste not found' },
      { status: 404 }
    );
  }

  // Check if paste has expired by time
  if (paste.expiresAt && Date.now() > paste.expiresAt) {
    store.pastes.delete(id);
    return NextResponse.json(
      { error: 'Paste has expired' },
      { status: 410 }
    );
  }

  // Check if paste has reached max views
  if (paste.maxViews && paste.views >= paste.maxViews) {
    store.pastes.delete(id);
    return NextResponse.json(
      { error: 'Paste has reached maximum views' },
      { status: 410 }
    );
  }

  // Increment view count
  paste.views += 1;

  // If this view reaches max views, we'll return it but it will be deleted on next access
  return NextResponse.json({
    content: paste.content,
    views: paste.views,
    maxViews: paste.maxViews,
    expiresAt: paste.expiresAt,
  });
}