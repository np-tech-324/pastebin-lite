import PasteViewer from "./PasteViewer";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return (
      <div className="min-h-screen bg-red-100 p-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-700">Invalid paste ID</p>
        </div>
      </div>
    );
  }

  return <PasteViewer id={id} />;
}