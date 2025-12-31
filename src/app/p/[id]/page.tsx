import PasteViewer from "./PasteViewer";
import "./page.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return (
      <div className="page error-page">
        <div className="card">
          <h1 className="title error-title">Error</h1>
          <p className="text">Invalid paste ID</p>
        </div>
      </div>
    );
  }

  return <PasteViewer id={id} />;
}
