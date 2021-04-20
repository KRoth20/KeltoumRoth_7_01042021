const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer_config');

const postControl = require('../controllers/post');

router.get('/posts/:id', auth, postControl.getPosts);
router.post('/posts', auth, multer, postControl.createPost);
router.post('/posts/like', auth, postControl.likePost);
router.delete('/posts/:id', auth, postControl.deletePost);

module.exports = router;