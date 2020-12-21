const controller = require('../controllers/leaves');

module.exports = (router) => {
  router.route('/get-leave-types')
    .get(controller.getLeaveTypes);
  router.route('/save-leave')
    .post(controller.saveLeave)
  router.route('/get-leave')
    .post(controller.getLeave)
  router.route('/get-status')
    .get(controller.getStatus)
};
