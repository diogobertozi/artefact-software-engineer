'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { operationError, taskClient } from '../../lib/client';
import type { Task } from '../../lib/tasks';

export function TaskForm({ task }: { task?: Task }) {
  const [titulo, setTitle] = useState(task?.titulo ?? '');
  const [descricao, setDescription] = useState(task?.descricao ?? '');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!titulo.trim()) {
      setFeedback({ message: 'Enter a title.', error: true });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      if (task) {
        await taskClient.update.mutate({ id: task.id, titulo, descricao });
      } else {
        await taskClient.create.mutate({ titulo, descricao });
        setTitle('');
        setDescription('');
      }
      setFeedback({ message: task ? 'Task updated.' : 'Task created.', error: false });
    } catch (error) {
      setFeedback({ message: operationError(error), error: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} aria-busy={saving}>
      <label htmlFor="title">Title</label>
      <input id="title" name="title" value={titulo} onChange={(event) => setTitle(event.target.value)}
        required maxLength={120} disabled={saving} />
      <label htmlFor="description">Description <span>(optional)</span></label>
      <textarea id="description" name="description" value={descricao}
        onChange={(event) => setDescription(event.target.value)} rows={4} maxLength={2000} disabled={saving} />
      <div className="actions">
        <button className="button" type="submit" disabled={saving}>
          {saving ? 'Saving…' : task ? 'Save changes' : 'Create task'}
        </button>
        <Link href="/" prefetch={false}>Back to tasks</Link>
      </div>
      {feedback && <p className={feedback.error ? 'error' : 'success'} role={feedback.error ? 'alert' : 'status'}>{feedback.message}</p>}
    </form>
  );
}
