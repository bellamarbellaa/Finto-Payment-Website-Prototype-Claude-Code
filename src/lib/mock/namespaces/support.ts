const FAQ = [
  { id: 'faq_1', question: 'How do I freeze a card?', answer: 'Open Cards, pick a card, and tap Freeze — it takes effect immediately.', category: 'Cards' },
  { id: 'faq_2', question: 'How long do transfers take?', answer: "Finto-to-Finto payments settle instantly. Everything else follows your bank's usual timing.", category: 'Payments' },
  { id: 'faq_3', question: 'Is my card number stored?', answer: 'No — card numbers are kept outside the Finto database entirely.', category: 'Security' }
];

export function createSupportApi() {
  return {
    async faq(q?: string) {
      const items = q ? FAQ.filter((f) => f.question.toLowerCase().includes(q.toLowerCase())) : FAQ;
      return { faq: items };
    },

    async tickets() {
      return { tickets: [] };
    },

    async createTicket(input: { subject: string; message: string; transactionId?: string }) {
      return { ticket: { id: `ticket_${Date.now().toString(36)}`, status: 'open', createdAt: new Date().toISOString(), ...input } };
    }
  };
}
