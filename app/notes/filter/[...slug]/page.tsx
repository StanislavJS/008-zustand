// app/notes/filter/[...slug]/page.tsx
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
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

// 🔹 Хелпер для отримання тегу
async function getFilterParams(
  params: Promise<{ slug?: string[] }>
) {
  const { slug } = await params;
  let tag: string | undefined = slug?.[0];
  if (tag === 'All') tag = undefined;
  return { tag, slug };
}

// ✅ SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
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

// ✅ Сторінка
export default async function NotesFilterPage({
  params,
}: NotesFilterPageProps) {
  const { tag } = await getFilterParams(params);

  const queryClient = new QueryClient();

  // Prefetch тільки для поточного тегу
  await queryClient.prefetchQuery<NotesResponse>({
    queryKey: ['notes', 1, '', tag], // сторінка 1 та порожній пошук
    queryFn: () => fetchNotes(1, '', 12, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={isNoteTag(tag) ? tag : 'All'} />
    </HydrationBoundary>
  );
}
