import css from './NoteForm.module.css'
import { ErrorMessage, Field, Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import toast from 'react-hot-toast';


interface NoteFormValues {
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
}

interface NoteFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NoteForm({onClose}: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleSubmit = useCallback(
    (values: NoteFormValues, action: FormikHelpers<NoteFormValues>) => {
      mutation.mutate(values, {
        onSuccess: () => {
          action.resetForm();
          toast.success('📝 Note created successfully');
          onClose();
        },
      });
    },
    [mutation, onClose]
  );

  const Schema = Yup.object().shape({
    title: Yup.string()
     .min(3, 'Title must be at least 3 characters')
     .max(50, 'Title is too long')
     .required('Title is required'),
    content: Yup.string()
     .max(500, 'Content is too long'),
    tag: Yup.string()
     .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid category')
     .required('Tag is required'),
  });

  return (
    <Formik 
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={handleSubmit}>
      <Form className={css.form}>
       <div className={css.formGroup}>
        <label htmlFor='note-title'>Title</label>
          <Field
            id='note-title'
            type='text'
            name='title'
            className={css.input}
          />
          <ErrorMessage
            name='title'
            component='span'
            className={css.error}
          />
       </div>

       <div className={css.formGroup}>
         <label htmlFor='note-content'>Content</label>
          <Field
           as='textarea'
           id='note-content'
           name='content'
           rows={8}
           className={css.textarea}
          />
          <ErrorMessage
            name='content'
            component='span'
            className={css.error}
          />
       </div>

       <div className={css.formGroup}>
        <label htmlFor='note-tag'>Tag</label>
          <Field
            as='select'
            id='note-tag'
            name='tag'
            className={css.select}>
            <option value='Todo'>Todo</option>
            <option value='Work'>Work</option>
            <option value='Personal'>Personal</option>
            <option value='Meeting'>Meeting</option>
            <option value='Shopping'>Shopping</option>
          </Field>
          <ErrorMessage
            name='tag'
            component='span'
            className={css.error}
          />
       </div>

       <div className={css.actions}>
        <button 
         type='button' 
         className={css.cancelButton}
         onClick={onClose}>
          Cancel
       </button>
        <button
         type='submit'
         className={css.submitButton}
         disabled={mutation.isPending}>
          Create note
       </button>
       </div>
     </Form>
   </Formik>
  )
}