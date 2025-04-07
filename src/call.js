const { sleep } = require('./sleep');
const { initAxios } = require('./axios');
const moment = require('moment');
const timeFormat = 'HH:mm:ss.SSS';

const waitCalls = async (url, num) => {
  const axios = initAxios();
  let reqs = [];
  for(let i = 0; i < num; i++) {
    reqs.push( axios.get(url).catch(e => {}) );
    await sleep(50);
  }
  return await Promise.all(reqs);
}

const calculateResults = (data) => {
  let durations = data.filter(item => !!item)
                      .map((item) => item.duration);
  let sum = 0, min, max;
  for (const duration of durations) {
    sum += duration;
    max = !max ? duration : Math.max(max, duration);
    min = !min ? duration : Math.min(min, duration);
  }
  let avg = sum / durations.length;
  return {sum, avg, min, max};
}

/**
 * Call GET on {url} {num} times, waiting 100ms between calls.
 * 
 * @param {string} label Label to identify app
 * @param {number} num Number of calls
 * @param {string} url Url to call
 * @returns 
 */
const callTest = async (label, num, url) => {
  const init = moment();
  console.log(`Start ${label} time:`, init.format(timeFormat));

  const data = await waitCalls(url, num);
  const results = calculateResults(data);

  const end = moment()
  const totalTime = moment.duration(end.diff(init));
  console.log(`End ${label} | time: ${end.format(timeFormat)} | tests: ${num} | Total Duration: ${totalTime.asMilliseconds()}`);

  return results;
}

module.exports = {callTest};