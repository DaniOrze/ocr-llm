import DocumentView from "@/components/DocumentView/DocumentView";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <DocumentView documentId={id} />;
}
