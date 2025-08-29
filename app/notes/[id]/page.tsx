// app/notes/[id]/page.tsx
import NotePreview from "../../@modal/(.)notes/[id]/NotePreview.client";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://your-vercel-domain.vercel.app";

interface NotePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = params;
  const note = await fetchNoteById(id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content?.slice(0, 150) || "Preview note in NoteHub.",
    openGraph: {
      title: `${note.title} | NoteHub`,
      description: note.content?.slice(0, 150) || "Preview note in NoteHub.",
      url: `${SITE_URL}/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Note Preview OG Image",
        },
      ],
    },
  };
}

export default async function NotePreviewPage({ params }: NotePageProps) {
  const { id } = params;

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
