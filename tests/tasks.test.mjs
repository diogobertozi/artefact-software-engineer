import assert from 'node:assert/strict';
import test from 'node:test';
import { createTRPCClient, httpLink } from '@trpc/client';

const url = process.env.TEST_APP_URL ?? 'http://127.0.0.1:3000';
const tasks = createTRPCClient({ links: [httpLink({ url: `${url}/api/trpc` })] });

test('CRUD, request-time HTML, validation and missing-task errors', async () => {
  await assert.rejects(tasks.create.mutate({ titulo: '   ' }), { message: 'Enter a title.' });
  const created = await tasks.create.mutate({
    titulo: '  Example review task  ', descricao: 'A fictional task',
  });
  assert.equal(created.titulo, 'Example review task');
  assert.match(created.id, /^[0-9a-f-]{36}$/i);
  assert.ok(Number.isFinite(Date.parse(created.dataCriacao)));
  try {
    assert.ok((await tasks.list.query()).some(({ id }) => id === created.id));
    const page = await fetch(url);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /<h2>Example review task<\/h2>/);

    const edited = await tasks.update.mutate({ id: created.id, titulo: 'Updated example', descricao: '' });
    assert.equal(edited.id, created.id);
    assert.equal(edited.dataCriacao, created.dataCriacao);
    assert.equal(edited.titulo, 'Updated example');
    assert.equal(edited.descricao, undefined);

    await tasks.delete.mutate({ id: created.id });
    assert.ok(!(await tasks.list.query()).some(({ id }) => id === created.id));
    assert.doesNotMatch(await (await fetch(url)).text(), /<h2>Updated example<\/h2>/);
    await assert.rejects(tasks.update.mutate({ id: created.id, titulo: 'Missing' }),
      (error) => error.data?.code === 'NOT_FOUND');
    await assert.rejects(tasks.delete.mutate({ id: created.id }),
      (error) => error.data?.code === 'NOT_FOUND');
  } finally {
    if ((await tasks.list.query()).some(({ id }) => id === created.id)) {
      await tasks.delete.mutate({ id: created.id });
    }
  }
});
