const express = require('express');
const musicController = require('../controller/music.controller');
const multer = require('multer');
const authMiddleware = require("../middlewares/auth.middleware")

const upload = multer({
    storage: multer.memoryStorage()
})


const router = express.Router();

router.post("/upload", authMiddleware.authArtist ,upload.single("music"), musicController.createMusic); 
router.post("/album", authMiddleware.authArtist , musicController.createAlbum);
router.get("/", authMiddleware.authUser , musicController.getallmusics);
router.get("/getallalbum", authMiddleware.authUser , musicController.getallalbums);

router.get("/getallalbum/:albumId", authMiddleware.authUser , musicController.getallalbumbyid )

module.exports = router;