import { FintoApiError, type Contact } from '../types';
import type { DemoStore } from '../store';

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

export function createContactsApi(store: DemoStore) {
  return {
    async list(q?: string) {
      let contacts = store.get().contacts;
      if (q) {
        const needle = q.toLowerCase();
        contacts = contacts.filter(
          (c) => c.name.toLowerCase().includes(needle) || c.handle.toLowerCase().includes(needle)
        );
      }
      return { contacts };
    },

    async create(input: { name: string; handle: string; tint?: string }) {
      const contact: Contact = {
        id: `contact_${Date.now().toString(36)}`,
        name: input.name,
        handle: input.handle,
        firstName: input.name.split(' ')[0] ?? input.name,
        initials: initialsOf(input.name),
        tint: input.tint ?? 'stone',
        isFavourite: false,
        isFintoUser: false,
        lastPaidAt: null
      };
      store.mutate((s) => {
        s.contacts.push(contact);
      });
      return { contact };
    },

    async update(id: string, patch: { name?: string; isFavourite?: boolean; tint?: string }) {
      const exists = store.get().contacts.some((c) => c.id === id);
      if (!exists) throw new FintoApiError(404, 'not_found', 'Contact not found.');
      store.mutate((s) => {
        Object.assign(s.contacts.find((c) => c.id === id)!, patch);
      });
      return { contact: store.get().contacts.find((c) => c.id === id)! };
    },

    async remove(id: string) {
      const exists = store.get().contacts.some((c) => c.id === id);
      if (!exists) throw new FintoApiError(404, 'not_found', 'Contact not found.');
      store.mutate((s) => {
        s.contacts = s.contacts.filter((c) => c.id !== id);
      });
    },

    async lookup(handle: string) {
      const contact = store.get().contacts.find((c) => c.handle.toLowerCase() === handle.toLowerCase());
      return {
        found: !!contact,
        user: contact
          ? { fullName: contact.name, handle: contact.handle, tint: contact.tint, initials: contact.initials }
          : null
      };
    }
  };
}
