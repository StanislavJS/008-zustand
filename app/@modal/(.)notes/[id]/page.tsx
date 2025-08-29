// app/@modal/(.)notes/[id]/page.tsx
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NotePreview from './NotePreview.client';

interface NotePreviewPageProps {
  params: Promise<{ id: string }>; // ✅ Next.js дає проміс
}

export default async function NotePreviewPage({ params }: NotePreviewPageProps) {
  const { id } = await params; // ✅ await для отримання id

  const queryClient = new QueryClient();

  // Попереднє завантаження даних нотатки
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
}
