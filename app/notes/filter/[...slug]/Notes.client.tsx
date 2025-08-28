'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import type { NoteTag } from '@/types/note';

import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from '@/components/NotePage/NotePage.module.css';

type NotesClientProps = {
  initialPage: number;
  initialSearch: string;
  initialTag: 'All' | NoteTag;
};

export default function NotesClient({
  initialPage,
  initialSearch,
  initialTag,
}: NotesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // debounce тільки для пошуку (щоб не спамити API)
  const [debouncedSearchTerm] = useDebounce(searchTerm, 800);
  const perPage = 12;

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', debouncedSearchTerm, currentPage, initialTag],
    queryFn: () =>
      fetchNotes(
        currentPage,
        debouncedSearchTerm,
        perPage,
        initialTag === 'All' ? undefined : initialTag
      ),
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearchChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            pageCount={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes.</p>}

      {notes.length > 0 ? (
        <NoteList notes={notes} onSelectNote={() => {}} />
      ) : (
        !isLoading && <p className={css.emptyMessage}>No notes found.</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
