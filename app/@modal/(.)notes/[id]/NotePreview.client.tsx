'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import css from '@/components/NotePreview/NotePreview.module.css';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api';
import type { Note } from '@/types/note';

interface NotePreviewProps {
  noteId: string;
}

export default function NotePreview({ noteId }: NotePreviewProps) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  const close = () => router.back();

  return (
    <Modal onClose={close}>
      <div className={css.container}>
        <button className={css.closeButton} onClick={close}>
          Close
        </button>

        {isLoading && <p>Loading...</p>}
        {isError && <p>Something went wrong.</p>}

        {note && (
          <>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            {note.tag && <p className={css.tag}>Tag: {note.tag}</p>}
            <p>
              {note.updatedAt
                ? `Updated: ${new Date(note.updatedAt).toLocaleString()}`
                : `Created: ${new Date(note.createdAt).toLocaleString()}`}
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
