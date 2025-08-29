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
  params: Promise<{ id: string }>; // ✅ Next.js App Router дає проміс
}

// 🔹 Хелпер, щоб не дублювати код
async function getNoteByParams(params: Promise<{ id: string }>) {
  const { id } = await params;
  const note = await fetchNoteById(id);
  return { id, note };
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { id, note } = await getNoteByParams(params);

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
  const { id, note } = await getNoteByParams(params);

  const queryClient = new QueryClient();
  // 💡 одразу кладемо note у кеш, щоб не робити повторний fetch
  queryClient.setQueryData(["note", id], note);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
}
