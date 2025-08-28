import styles from '@/components/LayoutNotes/LayoutNotes.module.css';

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};


const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <section className={styles.container}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <div className={styles.notesWrapper}>{children}</div>
    </section>
  );
};

export default NotesLayout;
