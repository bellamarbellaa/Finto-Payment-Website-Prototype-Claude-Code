import { createDemoStore } from './store';
import { createAuthApi } from './namespaces/auth';
import { createRealtimeApi } from './namespaces/realtime';
import { createUsersApi } from './namespaces/users';
import { createAccountsApi } from './namespaces/accounts';
import { createTransactionsApi } from './namespaces/transactions';
import { createPaymentsApi } from './namespaces/payments';
import { createContactsApi } from './namespaces/contacts';
import { createCardsApi } from './namespaces/cards';
import { createNotificationsApi } from './namespaces/notifications';
import { createFxApi } from './namespaces/fx';
import { createSupportApi } from './namespaces/support';
import { createDevicesApi } from './namespaces/devices';

function createMockFintoClient() {
  const store = createDemoStore();

  return {
    auth: createAuthApi(store),
    users: createUsersApi(store),
    accounts: createAccountsApi(store),
    transactions: createTransactionsApi(store),
    payments: createPaymentsApi(store),
    contacts: createContactsApi(store),
    cards: createCardsApi(store),
    notifications: createNotificationsApi(store),
    devices: createDevicesApi(),
    fx: createFxApi(),
    support: createSupportApi(),
    ...createRealtimeApi(store)
  };
}

export type MockFintoClient = ReturnType<typeof createMockFintoClient>;

/** One client for the whole tab — every screen imports this same instance. */
export const api = createMockFintoClient();
