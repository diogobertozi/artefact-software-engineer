import { notFound } from 'next/navigation';
import { taskCaller } from '../../../../lib/tasks';
import { TaskForm } from '../../task-form';

export const dynamic = 'force-dynamic';

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = (await taskCaller.list()).find((item) => item.id === id);
  if (!task) notFound();
  return <><h1>Edit task</h1><TaskForm task={task} /></>;
}
