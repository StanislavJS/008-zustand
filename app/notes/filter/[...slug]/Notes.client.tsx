'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import type { NoteTag } from '@/types/note';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Link from 'next/link';
import css from '@/components/NotePage/NotePage.module.css';

type NotesClientProps = {
  initialTag: 'All' | NoteTag;
};

export default function NotesClient({ initialTag }: NotesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 800);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTag, setCurrentTag] = useState(initialTag);

  const perPage = 12;

  useEffect(() => {
    // При зміні тегу скидаємо сторінку
    setCurrentPage(1);
    setCurrentTag(initialTag);
  }, [initialTag]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', debouncedSearchTerm, currentPage, currentTag],
    queryFn: () =>
      fetchNotes(
        currentPage,
        debouncedSearchTerm,
        perPage,
        currentTag === 'All' ? undefined : currentTag
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

        <Link href="/notes/action/create" className={css.button}>
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
    </div>
  );
}
