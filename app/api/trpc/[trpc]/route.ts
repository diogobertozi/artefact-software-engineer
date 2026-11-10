import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { taskRouter } from '../../../../lib/tasks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: taskRouter,
    createContext: () => ({}),
  });
}

export { handler as GET, handler as POST };
