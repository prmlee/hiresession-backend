

function keGetCurrentDate(){
    let date_ob = new Date(Date.now());
    return date_ob;
    return{
      year:date_ob.getFullYear(),
      month:date_ob.getMonth() + 1,
      date:date_ob.getDate(),
      hours:date_ob.getHours(),
      minutes:date_ob.getMinutes(),
      seconds:date_ob.getSeconds()
    }
}
function keConvertLocalToUTC(timeString,timeZoneName)
{
  let date_ob = new Date(timeString);
  switch(timeZoneName)
  {
    case 'EST':
      {
        date_ob = new Date(date_ob.getTime()+240*60*1000);
        break;
      }
    case 'MST':
        {
          date_ob = new Date(date_ob.getTime()+320*60*1000);
          break;
        }
    case 'US/Pacific':
      {
        date_ob = new Date(date_ob.getTime()+420*60*1000);
        break;
      }
  }
  return date_ob;
    return{
      year:date_ob.getFullYear(),
      month:date_ob.getMonth() + 1,
      date:date_ob.getDate(),
      hours:date_ob.getHours(),
      minutes:date_ob.getMinutes(),
      seconds:date_ob.getSeconds()
    }
}

  module.exports = {keGetCurrentDate,keConvertLocalToUTC}