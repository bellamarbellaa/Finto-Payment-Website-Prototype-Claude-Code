import { describe, expect, it } from 'vitest';
import { createDemoStore } from '../store';
import { createMemoryStorage } from '../testSupport';
import { createCardsApi } from './cards';

function setup() {
  const store = createDemoStore(createMemoryStorage());
  return { store, cards: createCardsApi(store) };
}

describe('createCardsApi', () => {
  it('freeze() flips card state and fires a card.updated event', async () => {
    const { store, cards } = setup();
    const events: string[] = [];
    store.subscribe((e) => events.push(e.type));

    const { card } = await cards.freeze('card_virtual', true);
    expect(card.state).toBe('frozen');
    expect(events).toContain('card.updated');
  });

  it('updateControls() converts a monthly limit string into Money', async () => {
    const { cards } = setup();
    const { card } = await cards.updateControls('card_physical', { monthlyLimit: '500.00' });
    expect(card.controls.monthlyLimit?.amount).toBe('500.00');
    expect(card.controls.monthlyLimit?.currency).toBe('USD');
  });

  it('updateControls() clears the monthly limit when passed null', async () => {
    const { cards } = setup();
    await cards.updateControls('card_virtual', { monthlyLimit: null });
    const { card } = await cards.get('card_virtual');
    expect(card.controls.monthlyLimit).toBeNull();
  });

  it('get() throws not_found for an unknown card', async () => {
    const { cards } = setup();
    await expect(cards.get('nope')).rejects.toMatchObject({ code: 'not_found' });
  });
});
