const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const commentControl = require('../controllers/comment');

router.post('/comment', auth, commentControl.commentPost);
router.put('/comment', auth, commentControl.modifyComment);
router.delete('/comment/:id', auth, commentControl.deleteComment);

module.exports = router;