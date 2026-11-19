import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const base = __ENV.RECIPE_API_URL || 'http://localhost:18081';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base)) {
  throw new Error('Use an isolated loopback backend');
}

const listingDuration = new Trend('listing_duration', true);
export const options = {
  vus: 10,
  duration: '10s',
  thresholds: { 'http_req_failed{scenario:default}': ['rate<0.01'], listing_duration: ['p(95)<500'], checks: ['rate==1'] },
  summaryTrendStats: ['avg', 'med', 'p(95)', 'max'],
};

export function setup() {
  const response = http.post(base + '/api/auth/register/buyer', JSON.stringify({
    name: 'Load fixture',
    email: 'load-' + Date.now() + '@example.test',
    password: 'fixture-' + Date.now(),
  }), { headers: { 'Content-Type': 'application/json' } });
  if (response.status !== 200 || !response.json('token')) {
    throw new Error('Fixture registration failed: HTTP ' + response.status);
  }
  return { token: response.json('token') };
}

export default function ({ token }) {
  const response = http.get(base + '/api/recipes', {
    headers: { Authorization: 'Bearer ' + token },
  });
  listingDuration.add(response.timings.duration);
  check(response, {
    'listing returns 200 with a JSON array': result => result.status === 200 && Array.isArray(result.json()),
  });
  sleep(0.1);
}
