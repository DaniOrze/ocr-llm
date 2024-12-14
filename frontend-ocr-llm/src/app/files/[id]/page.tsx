import DocumentView from "@/components/DocumentView/DocumentView";


export default function DocumentPage({ params }: { params: { id: string } }) {
  return <DocumentView documentId={params.id} />;
}
