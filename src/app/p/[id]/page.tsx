import { notFound } from "next/navigation";

async function getPaste(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paste = await getPaste(id);

  if (!paste) notFound();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Paste</h1>

        <pre className="bg-gray-50 p-4 rounded border whitespace-pre-wrap">
          {paste.content}
        </pre>

        <p className="text-sm text-gray-500 mt-4">
          Views: {paste.views}
        </p>
      </div>
    </div>
  );
}
