const controller = require('../controllers/users');

module.exports = (router) => {
  router.route('/generate-password')
    .post(controller.generatePassword);
  router.route('/password-login')
    .post(controller.passwordLogn)
};