// app/notes/filter/[...slug]/page.tsx
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { NotesResponse, NoteTag } from '@/types/note';
import { dehydrate, QueryClient, HydrationBoundary } from '@tanstack/react-query';

function isNoteTag(value: string | undefined): value is NoteTag {
  return ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'].includes(value ?? '');
}

interface NotesFilterPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function NotesFilterPage({ params, searchParams }: NotesFilterPageProps) {
  const { slug } = await params;
  const { page: rawPage, search: rawSearch } = await searchParams;

  const page = Number(rawPage) || 1;
  const search = rawSearch || '';

  let tag: string | undefined = slug[0];
  if (tag === 'All') tag = undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<NotesResponse>({
    queryKey: ['notes', page, search, tag],
    queryFn: () => fetchNotes(page, search, 12, tag),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
  <HydrationBoundary state={dehydratedState}>
    <NotesClient
      initialPage={page}
      initialSearch={search}
      initialTag={isNoteTag(tag) ? tag : 'All'}
    />
  </HydrationBoundary>
);
}