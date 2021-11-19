const express = require(`express`);
const viewController = require(`./../controllers/viewController.js`);
const authController = require(`./../controllers/authController.js`);

const router = express.Router();

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

//login

module.exports = router;
