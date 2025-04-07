require('dotenv').config();
const { compareTest } = require('./compare');

async function main(){
  const apps = [
    {name: 'url-1', url: 'http://localhost/'},
    {name: 'url-2', url: 'http://localhost/'},
    {name: 'url-3', url: 'http://localhost/'}
  ]

  const loops = process.env.LOOPS || 2;
  const requestsPerLoop = process.env.REQUESTS_PER_LOOP || 2;
  let results = await compareTest(loops, requestsPerLoop, apps);

  return results;
}

main().then((results) => {
    console.log('Results: ', results);
}).catch(console.error);