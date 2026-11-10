import { createTRPCClient, httpLink, TRPCClientError } from '@trpc/client';
import type { TaskRouter } from './tasks';

export const taskClient = createTRPCClient<TaskRouter>({
  links: [httpLink({ url: '/api/trpc' })],
});

export function operationError(error: unknown) {
  return error instanceof TRPCClientError && error.data && error.data.code !== 'INTERNAL_SERVER_ERROR'
    ? error.message
    : 'The request could not be completed. Try again.';
}
