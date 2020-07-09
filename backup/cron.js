const CronJob = require('cron').CronJob;
const db_dumper = require('./backup.js');


// AutoBackUp every week (at 00:00 on Sunday)
new CronJob(
  '0 * *  * *',
  function() {
    db_dumper();
  },
  null,
  true,
  'America/New_York'
);