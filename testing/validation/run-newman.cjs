const fs = require('node:fs');
const path = require('node:path');
const newman = require('newman');
const root = path.resolve(__dirname, '../../testing-documentation');
const postman = path.join(root, '09-Postman');
const evidence = path.join(root, '13-Test-Results/API');
const baseUrl = process.env.RECIPE_API_URL || 'http://localhost:18081';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(baseUrl)) {
  throw new Error('Use an isolated loopback backend');
}

const collection = require(path.join(postman, 'Ecommerce-Recipe-Platform.postman_collection.json'));
newman.run({
  collection,
  environment: require(path.join(postman, 'Test-Environment.postman_environment.json')),
  envVar: [{ key: 'baseUrl', value: baseUrl }],
  reporters: [],
}, (error, summary) => {
  if (error) {
    console.error('Newman could not start:', error.name);
    process.exitCode = 1;
    return;
  }
  const scenarios = summary.run.executions.map(execution => ({
    name: execution.item.name,
    httpStatus: execution.response?.code ?? null,
    assertions: execution.assertions.map(assertion => ({
      name: assertion.assertion,
      status: assertion.skipped ? 'NOT EXECUTED' : assertion.error ? 'FAIL' : 'PASS',
    })),
  }));
  const expected = collection.item.length;
  fs.mkdirSync(evidence, { recursive: true });
  const output = { baseUrl, expected, statistics: summary.run.stats, scenarios };
  fs.writeFileSync(path.join(evidence, 'newman.json'), JSON.stringify(output, null, 2) + '\n');
  for (const scenario of scenarios) {
    console.log(scenario.name, scenario.httpStatus, scenario.assertions.map(item => item.status).join(', '));
  }
  if (summary.run.failures.length || scenarios.length !== expected) process.exitCode = 1;
});
