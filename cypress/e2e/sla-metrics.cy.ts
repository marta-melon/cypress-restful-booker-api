// P95 SLA
import { Api } from '../support/apiClient';

function p95(arr: number[]) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil(0.95 * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

describe('SLA p95', { tags: ['@quality', '@sla'] }, () => {
  it('GET /booking – p95 < env.SLA_P95_GET', () => {
    const times: number[] = [];
    const runs = 10;
    cy.wrap(null).then(() => {
      const loop = (i: number) => {
        if (i >= runs) return;
        const t0 = performance.now();
        Api.listIds().then((res) => {
          times.push(performance.now() - t0);
          cy.recordMetric('get-booking-ids.csv', 'GET', '/booking', times[times.length - 1], res.status);
          loop(i + 1);
        });
      };
      loop(0);
    });
    cy.then(() => {
      const p = p95(times);
      expect(p).to.be.lessThan(Cypress.env('SLA_P95_GET'));
    });
  });
});
