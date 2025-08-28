import { Note } from "./note";

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

export type { Note };