const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer_config');

const userControl = require('../controllers/user');

router.post('/auth/signup', userControl.signup);
router.post('/auth/login', userControl.login);
router.post('/user', auth, userControl.getOneUser);
router.put('/user/changepassword', auth, userControl.changePassword);
router.put('/user/avatar', auth, multer, userControl.changeAvatar);
router.delete('/user/:id', auth, userControl.deleteUser);

module.exports = router;
