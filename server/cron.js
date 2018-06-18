const cron = require('cron')
const run = require('./services/booksProcessor')

const fetchAndProcessBooksJob = new cron.CronJob(
  // '0 0 * * * * *',
  // '0 */5 * * * *',
  '0 0 * * 0',

  async function () {
    console.log('Start fetching and processing new books')
    await run()
    console.log('Finished fetching and processing new books')
  },
  null,
  true,
  'America/New_York'
)

// '0 */5 * * * *',

