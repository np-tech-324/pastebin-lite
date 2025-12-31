import { NextResponse } from 'next/server';

const store = globalThis as unknown as {
  pastes?: Map<string, { content: string }>;
};

if (!store.pastes) {
  store.pastes = new Map();
}

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

  return NextResponse.json(paste);
}