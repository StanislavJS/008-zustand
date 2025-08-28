import Link from 'next/link';
import css from '@/components/SidebarNotes/SidebarNotes.module.css';
import { NoteTag } from '@/types/note';

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const SidebarNotes = ({ activeTag }: { activeTag?: NoteTag | 'All' }) => {
  const getLinkClass = (tag: NoteTag | 'All') =>
    activeTag === tag ? `${css.menuLink} ${css.active}` : css.menuLink;

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes/filter/All" className={getLinkClass('All')} role="menuitem">
          All
        </Link>
      </li>
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={getLinkClass(tag)} role="menuitem">
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNotes;
