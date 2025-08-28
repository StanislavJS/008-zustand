export type NoteTag = 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo';

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface Note {
  id: string;
  title: string;
  content: string;
  tag?: NoteTag;
  createdAt: string;
  updatedAt?: string;
}

export type NewNoteData = {
  title: string;
  content: string;
  tag?: NoteTag;
};

