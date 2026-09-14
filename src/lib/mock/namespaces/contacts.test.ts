import { describe, expect, it } from 'vitest';
import { createDemoStore } from '../store';
import { createMemoryStorage } from '../testSupport';
import { createContactsApi } from './contacts';

function setup() {
  const store = createDemoStore(createMemoryStorage());
  return { store, contacts: createContactsApi(store) };
}

describe('createContactsApi', () => {
  it('lists all seeded contacts with no query', async () => {
    const { contacts } = setup();
    const { contacts: list } = await contacts.list();
    expect(list).toHaveLength(4);
  });

  it('filters by name or handle', async () => {
    const { contacts } = setup();
    const { contacts: list } = await contacts.list('june');
    expect(list.map((c) => c.id)).toEqual(['contact_june']);
  });

  it('create() adds a new contact', async () => {
    const { store, contacts } = setup();
    await contacts.create({ name: 'Priya Nair', handle: '@priya' });
    expect(store.get().contacts).toHaveLength(5);
  });
});
