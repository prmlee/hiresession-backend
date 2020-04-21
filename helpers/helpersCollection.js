function errorInstance(message, code) {
  const errObj = new Error(message);
  errObj.code = code;
  return errObj;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function normalizeResponseData(data) {
  return {
    payload: data
  };
}

const customerStatus = Object.freeze({
  deleted: 'deleted',
  pending: 'pending',
  inactive: 'inactive',
  active: 'active'
});

module.exports = {errorInstance, isNumeric, normalizeResponseData, customerStatus};
