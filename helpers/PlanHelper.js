const configs = require('../config');
const { Plans } = configs;

function getAccess(planId) {
  let return_string = '';

  for (let key in Object.values(Plans)) {
    for (let c in Object.values(Plans)[key]) {
      if(Object.values(Plans)[key][c] === planId) {
        return_string = `${Object.keys(Plans)[key]}`;
      }
    }
  }

  return return_string;
}

function checkAccess(planId, level) {

  const tarif = getAccess(planId);

  if(!level.includes(tarif)) {
    return false;
  }

  return true;
}

module.exports = {getAccess, checkAccess};
