import NotePreview from "../../@modal/(.)notes/[id]/NotePreview.client";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";

type Props = { params: Promise<{ id: string }> };



export default async function NotePreviewModal({ params }: Props) {
  const { id } = await params; // <- тут await
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
}