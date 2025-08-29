'use client';

import css from './NoteForm.module.css';
import { ErrorMessage, Field, Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import toast from 'react-hot-toast';
import { useNoteStore } from '@/lib/store/noteStore';
import { useRouter } from 'next/navigation';

interface NoteFormProps {
  onClose: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleSubmit = useCallback(
    async (values: typeof draft, actions: FormikHelpers<typeof draft>) => {
      mutation.mutate(values, {
        onSuccess: () => {
          toast.success('📝 Note created successfully');
          clearDraft();        // сбрасываем черновик
          actions.resetForm(); // очищаем форму
          onClose();
          router.push('/notes/filter/All'); // 🚀 редирект на список заметок
        },
      });
    },
    [mutation, onClose, clearDraft, router]
  );

  const Schema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(50, 'Title is too long')
      .required('Title is required'),
    content: Yup.string().max(500, 'Content is too long'),
    tag: Yup.string()
      .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid category')
      .required('Tag is required'),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={draft} // данные из zustand
      validationSchema={Schema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="note-title">Title</label>
            <Field
              id="note-title"
              type="text"
              name="title"
              className={css.input}
              value={values.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDraft({ title: e.target.value })
              }
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="note-content">Content</label>
            <Field
              as="textarea"
              id="note-content"
              name="content"
              rows={8}
              className={css.textarea}
              value={values.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDraft({ content: e.target.value })
              }
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="note-tag">Tag</label>
            <Field
              as="select"
              id="note-tag"
              name="tag"
              className={css.select}
              value={values.tag}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDraft({ tag: e.target.value as typeof draft.tag })
              }
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={mutation.isPending}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
