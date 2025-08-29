'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { useRouter, usePathname} from 'next/navigation';
import type { NoteTag } from '@/types/note';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from '@/components/NotePage/NotePage.module.css';
import { useNoteStore } from '@/lib/store/noteStore';
import Link from 'next/link';


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
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { clearDraft } = useNoteStore();

  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();

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

  const handleOpenModal = () => {
    clearDraft();
    router.push('/notes/action/create'); // 🚀 переход вместо локального стейта
  };

  const handleCloseModal = () => {
    clearDraft();
    router.back(); // возвращаемся к /notes/filter/All
  };

  const isCreateRoute = pathname === '/notes/action/create';

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

       <Link className={css.button} href="/notes/action/create">
            Create note +
      </Link>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes.</p>}

      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        !isLoading && <p className={css.emptyMessage}>No notes found.</p>
      )}

      {isCreateRoute && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
