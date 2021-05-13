const express = require("express");
const router = express.Router();

const UserCtrl = require('../controllers/user');

router.post("/newAccount",UserCtrl.signup);
router.post("/VerifyAccount",UserCtrl.login);

module.exports = router;