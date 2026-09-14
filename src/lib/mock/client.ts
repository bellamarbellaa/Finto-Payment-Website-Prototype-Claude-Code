import { createDemoStore } from './store';

/** One store for the whole tab, same singleton pattern as the real app's lib/api.ts. */
export const store = createDemoStore();
