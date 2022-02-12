const express = require("express");
const router = express.Router();

const UserCtrl = require('../controllers/user');

router.post("/newAccount",UserCtrl.signup);
router.post("/VerifyAccount",UserCtrl.login);
router.get("/getuser/:userId",UserCtrl.getUser);
router.post("/updateuser",UserCtrl.modifyUser);

module.exports = router;