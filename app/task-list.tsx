'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { operationError, taskClient } from '../lib/client';
import type { Task } from '../lib/tasks';

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshing, refresh] = useTransition();
  const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null);

  async function deleteTask(task: Task) {
    setDeleting(task.id);
    setFeedback(null);
    try {
      await taskClient.delete.mutate({ id: task.id });
      setFeedback({ message: 'Task deleted.', error: false });
    } catch (error) {
      setFeedback({ message: operationError(error), error: true });
    } finally {
      refresh(() => router.refresh());
      setDeleting(null);
    }
  }

  return (
    <>
      {feedback && <p className={feedback.error ? 'error' : 'success'} role={feedback.error ? 'alert' : 'status'}>{feedback.message}</p>}
      {tasks.length === 0 ? <p className="empty">No tasks yet. Create a task to get started.</p> : (
        <ul className="tasks">
          {tasks.map((task) => (
            <li key={task.id}>
              <div className="task-copy">
                <h2>{task.titulo}</h2>
                {task.descricao && <p>{task.descricao}</p>}
                <small>Created <time dateTime={task.dataCriacao}>{task.dataCriacao.slice(0, 10)}</time> (UTC)</small>
              </div>
              <div className="actions">
                <Link href={`/tasks/${task.id}/edit`} prefetch={false} aria-label={`Edit ${task.titulo}`}>Edit</Link>
                <button type="button" className="danger" disabled={deleting !== null || refreshing}
                  onClick={() => deleteTask(task)} aria-label={`Delete ${task.titulo}`}>
                  {deleting === task.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
