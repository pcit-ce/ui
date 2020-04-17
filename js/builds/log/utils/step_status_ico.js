let success_ico = require('../../../icon/steps/success');
let running_ico = require('../../../icon/steps/running');
let failure_ico = require('../../../icon/steps/failure');

module.exports = (status) => {
  if (status === 'success') {
    return success_ico;
  }
  if (status === 'failure') {
    return failure_ico;
  }
  if (status === 'running') {
    return running_ico;
  }
};
