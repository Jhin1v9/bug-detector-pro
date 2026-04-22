/**
 * Teste de integração rápido para a API do BugDetector Cloud
 * Usage: node test-cloud.mjs
 */

const BASE = process.env.API_BASE || 'http://localhost:3456';

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

function assert(condition, message) {
  if (!condition) throw new Error(`❌ ${message}`);
  console.log(`✅ ${message}`);
}

async function run() {
  console.log(`Testing BugDetector Cloud at ${BASE}\n`);

  // Health
  const health = await request('/api/health');
  assert(health.status === 200 && health.body.ok, 'Health check');

  // Create report
  const report = {
    id: `test-${Date.now()}`,
    timestamp: new Date().toISOString(),
    description: 'Teste de integração',
    type: 'bug',
    severity: 'medium',
    url: 'http://localhost:5173',
    element: { tag: 'div', selector: 'div.test' },
    sessionReplay: { events: [], startTime: 0, endTime: 1, viewport: { width: 1280, height: 800 } },
  };
  const created = await request('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
  assert(created.status === 201 && created.body.saved, 'Create report');

  // Get report
  const fetched = await request(`/api/reports/${report.id}`);
  assert(fetched.status === 200 && fetched.body.id === report.id, 'Get report');

  // Stats
  const stats = await request('/api/stats');
  assert(stats.status === 200 && typeof stats.body.total === 'number', 'Stats');

  // Update status
  const updated = await request(`/api/reports/${report.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'resolved' }),
  });
  assert(updated.status === 200 && updated.body.updated, 'Update status');

  // Delete report
  const deleted = await request(`/api/reports/${report.id}`, { method: 'DELETE' });
  assert(deleted.status === 200 && deleted.body.deleted, 'Delete report');

  console.log('\n🎉 All tests passed!');
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
