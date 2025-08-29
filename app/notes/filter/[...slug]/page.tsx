import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { NotesResponse, NoteTag } from '@/types/note';
import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
} from '@tanstack/react-query';
import type { Metadata } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://your-vercel-domain.vercel.app';

function isNoteTag(value: string | undefined): value is NoteTag {
  return ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'].includes(value ?? '');
}

interface NotesFilterPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

// ✅ SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const filterName = slug?.join(' / ') || 'All';

  return {
    title: `Notes filtered by ${filterName} | NoteHub`,
    description: `Browse notes filtered by ${filterName} in NoteHub.`,
    openGraph: {
      title: `Notes filtered by ${filterName} | NoteHub`,
      description: `Browse notes filtered by ${filterName} in NoteHub.`,
      url: `${SITE_URL}/notes/filter/${slug?.join('/') ?? ''}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Filtered Notes OG Image',
        },
      ],
    },
  };
}

export default async function NotesFilterPage({
  params,
  searchParams,
}: NotesFilterPageProps) {
  const { slug } = await params;
  const { page: rawPage, search: rawSearch } = await searchParams;

  const page = Number(rawPage) || 1;
  const search = rawSearch || '';

  let tag: string | undefined = slug?.[0];
  if (tag === 'All') tag = undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<NotesResponse>({
    queryKey: ['notes', page, search, tag],
    queryFn: () => fetchNotes(page, search, 12, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        initialTag={isNoteTag(tag) ? tag : 'All'}
      />
    </HydrationBoundary>
  );
}
