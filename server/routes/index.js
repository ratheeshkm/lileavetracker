const users = require('./users');
const leaves = require('./leaves');

module.exports = (router) => {
  users(router);
  leaves(router);
	return router;
};