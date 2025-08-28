'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './TagsMenu.module.css';
import type { NoteTag } from '@/types/note';

interface TagsMenuProps {
  tags: NoteTag[];
}

export default function TagsMenu({ tags }: TagsMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const activeTag = pathname?.split('/').pop(); // остання частина URL

  const toggleMenu = useCallback(() => {
    setMenuVisible((visible) => !visible);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  useEffect(() => {
    if (!menuVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [menuVisible, closeMenu]);

  const getLinkClass = (tag: string) =>
    `${css.menuLink} ${activeTag === tag ? css.active : ''}`;
  

  return (
    <div className={css.menuContainer} ref={menuRef}>
      <button
        className={css.menuButton}
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={menuVisible}
        aria-label="Toggle notes filter menu"
      >
        Notes ▾
      </button>

      {menuVisible && (
        <ul className={css.menuList} role="menu">
          <li className={css.menuItem} role="none">
            <Link
              href="/notes/filter/All"
              className={getLinkClass('All')}
              role="menuitem"
              onClick={closeMenu}
            >
              All notes
            </Link>
          </li>

          {tags.map((tag) => (
            <li key={tag} className={css.menuItem} role="none">
              <Link
                href={`/notes/filter/${tag}`}
                className={getLinkClass(tag)}
                role="menuitem"
                onClick={closeMenu}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
