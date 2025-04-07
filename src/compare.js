const { sleep } = require('./sleep');
const { callTest } = require('./call');

const calculateResults = async (promises, name, results) => {
  let tests = await Promise.all(promises[name]);
  let avg = sum = 0, min, max;
  for(const test of tests) {
    sum += test.sum
    avg += test.avg;
    min = !min ? test.min : Math.min(min, test.min);
    max = !max ? test.max : Math.max(max, test.max);
  }
  results[name] = {
    sum: sum,
    avg: Math.round(avg / tests.length),
    min: min,
    max: max
  }
}

const makeCalls = async (testPromises, loops, requestsPerLoop, apps) => {
  for(let i = 1; i <= loops; i++){
    for(const app of apps) {
      if(!testPromises[app.name]) testPromises[app.name] = [];
      let promise = callTest(`${app.name}:${i}`, requestsPerLoop, app.url);
      testPromises[app.name].push(promise);
    }
    await sleep(50);
  }
}

const formatResults = async (testPromises, apps, results) => {
  const resultPromises = [];
  for(const app of apps) {
    if(!testPromises[app.name]) continue;
    let result = calculateResults(testPromises, app.name, results);
    resultPromises.push(result);
  }
  await Promise.all(resultPromises);
}

/**
 * Send requests and compare time results
 * 
 * @param {number} loops Number of times to call test for each app
 * @param {number} requestsPerLoop Number of request sent on each test
 * @param {object} apps Apps to test
 * @returns 
 */
const compareTest = async (loops, requestsPerLoop, apps) => {
    
  const testPromises = {};

  await makeCalls(testPromises, loops, requestsPerLoop, apps);

  const results = {};
  await formatResults(testPromises, apps, results);

  return {
    Loops: loops,
    RequestsPerLoop: requestsPerLoop,
    results
  };
}

module.exports = {compareTest};