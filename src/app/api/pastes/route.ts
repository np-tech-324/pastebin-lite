import { NextResponse } from 'next/server';

const store = globalThis as unknown as {
  pastes?: Map<string, { content: string }>;
};

if (!store.pastes) {
  store.pastes = new Map();
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid content' },
        { status: 400 }
      );
    }

    if (!store.pastes) {
      return NextResponse.json(
        { error: 'Storage not initialized' },
        { status: 500 }
      );
    }

    const id = genId();
    store.pastes.set(id, { content });

    return NextResponse.json({
      id,
      url: `/p/${id}`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}