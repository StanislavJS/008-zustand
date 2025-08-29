import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";
import Link from "next/link";

interface NoteListProps {
  notes?: Note[];
  onSelectNote?: (note: Note) => void;
}

export default function NoteList({ notes = [] }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      // обновляем все списки notes
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
  });

  if (notes.length === 0) {
    return <p>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <Link href={`/notes/${note.id}`} scroll={false} className={css.link}>
              View details
            </Link>

            <button
              type="button"
              className={css.button}
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (confirm(`Delete note "${note.title}"?`)) {
                  deleteMutation.mutate(note.id);
                }
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
      {deleteMutation.isError && (
        <p className={css.error}>Error deleting note. Try again.</p>
      )}
    </ul>
  );
}
