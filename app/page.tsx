import Link from 'next/link';
import { taskCaller } from '../lib/tasks';
import { TaskList } from './task-list';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const tasks = await taskCaller.list();

  return (
    <>
      <div className="heading">
        <h1>Tasks</h1>
        <Link className="button" href="/tasks/new">New task</Link>
      </div>
      <TaskList tasks={tasks} />
    </>
  );
}
