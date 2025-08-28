"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import css from '@/components/NoteDetails/NoteDetails.module.css';
import { useEffect, useState } from "react";

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const closeModal = () => {
    router.back();
  };

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return null;
  if (error || !note) return null;

  // Закрытие по клику на фон
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className={css.overlay} onClick={handleBackgroundClick}>
      <div className={css.modal}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>

        {isClient && (
          <p className={css.date}>
            {note.updatedAt
              ? `Updated at: ${new Date(note.updatedAt).toLocaleString()}`
              : `Created at: ${new Date(note.createdAt).toLocaleString()}`}
          </p>
        )}

        <a
          href="#"
          className={css.close}
          onClick={(e) => {
            e.preventDefault();
            closeModal();
          }}
        >
          Close
        </a>
      </div>
    </div>
  );
};

export default NoteDetailsClient;