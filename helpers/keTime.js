const IS_WINTER = false;
function keCalcTimeOffset(timezoneName)
{
    var r_value = 0;
    switch(timezoneName)
    {
        case 'EST':
        case 'EDT':
        case 'US/Eastern':
            {
                r_value = IS_WINTER? -300:-240;
                break;
            }
        case 'CST':
        case 'CDT':
            {
                r_value = IS_WINTER? -360:-300;
                break;
            }
        case 'MST':
        case 'MDT':
            {
                r_value = IS_WINTER? -420:-360;
                break;
            }
        case 'PST':
        case 'PDT':
        case 'US/Pacific':
            {
                r_value = IS_WINTER? -480:-420;
                break;
            }
    }
    return r_value;
}

function keGetCurrentDate(){
    let date_ob = new Date(Date.now());
    return date_ob;
    /*return{
      year:date_ob.getFullYear(),
      month:date_ob.getMonth() + 1,
      date:date_ob.getDate(),
      hours:date_ob.getHours(),
      minutes:date_ob.getMinutes(),
      seconds:date_ob.getSeconds()
    }*/
}
function keConvertLocalToUTC(timeString,timeZoneName)
{
  let date_ob = new Date(timeString);
  let offset = keCalcTimeOffset(timeZoneName);
  date_ob = new Date(date_ob.getTime()-offset*60*1000);
  return date_ob;
    /*return{
      year:date_ob.getFullYear(),
      month:date_ob.getMonth() + 1,
      date:date_ob.getDate(),
      hours:date_ob.getHours(),
      minutes:date_ob.getMinutes(),
      seconds:date_ob.getSeconds()
    }*/
}

function keConvertTimezoneName(timezoneName)
{
    var r_value = 0;
    switch(timezoneName)
    {
        case 'EST':
        case 'EDT':
        case 'US/Eastern':
            {
                r_value = 'America/New_York';
                break;
            }
        case 'CST':
        case 'CDT':
            {
                r_value = 'America/Chicago';
                break;
            }
        case 'MST':
        case 'MDT':
            {
                r_value = 'America/Denver';
                break;
            }
        case 'PST':
        case 'PDT':
        case 'US/Pacific':
            {
                r_value = 'America/Los_Angeles';
                break;
            }
    }
    return r_value;
}

module.exports = {keCalcTimeOffset,keGetCurrentDate,keConvertLocalToUTC,keConvertTimezoneName}