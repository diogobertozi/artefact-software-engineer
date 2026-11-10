import { randomUUID } from 'node:crypto';
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: string;
};

const processState = globalThis as typeof globalThis & {
  artefactTasks?: Map<string, Task>;
};

// shortcut: tasks live in one Node process and reset on restart; use a shared database for multiple instances.
const tasks = (processState.artefactTasks ??= new Map());

const id = z.object({ id: z.uuid() });
const fields = z.object({
  titulo: z.string().trim().min(1, 'Enter a title.').max(120, 'Use at most 120 characters for the title.'),
  descricao: z.string().trim().max(2000, 'Use at most 2,000 characters for the description.').optional(),
});

const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    if (error.cause instanceof z.ZodError) {
      return { ...shape, message: error.cause.issues[0]?.message ?? 'Check the task details.' };
    }
    return shape;
  },
});

function findTask(taskId: string) {
  const task = tasks.get(taskId);
  if (!task) throw new TRPCError({ code: 'NOT_FOUND', message: 'This task no longer exists.' });
  return task;
}

export const taskRouter = t.router({
  list: t.procedure.query(() => [...tasks.values()].reverse()),
  create: t.procedure.input(fields).mutation(({ input }) => {
    const task = {
      id: randomUUID(),
      titulo: input.titulo,
      descricao: input.descricao || undefined,
      dataCriacao: new Date().toISOString(),
    };
    tasks.set(task.id, task);
    return task;
  }),
  update: t.procedure.input(fields.extend(id.shape)).mutation(({ input }) => {
    const current = findTask(input.id);
    const task = { ...current, titulo: input.titulo, descricao: input.descricao || undefined };
    tasks.set(task.id, task);
    return task;
  }),
  delete: t.procedure.input(id).mutation(({ input }) => {
    if (!tasks.delete(input.id)) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'This task no longer exists.' });
    }
    return { id: input.id };
  }),
});

export type TaskRouter = typeof taskRouter;
export const taskCaller = taskRouter.createCaller({});
