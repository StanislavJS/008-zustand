// app/notes/action/create/page.tsx
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "../../../../components/CreateNote/CreateNote.module.css";
import type { Metadata } from "next";



export async function generateMetadata(): Promise<Metadata> {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-vercel-domain.vercel.app";

  return {
    title: "Create Note | NoteHub",
    description: "Start a new note in NoteHub — capture ideas, organize tasks, and manage your thoughts effortlessly.",
    openGraph: {
      title: "Create Note | NoteHub",
      description: "Start a new note in NoteHub — capture ideas, organize tasks, and manage your thoughts effortlessly.",
      url: `${SITE_URL}/notes/action/create`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Create Note OG Image",
        },
      ],
    },
  };
}


export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}