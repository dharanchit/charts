const express = require('express');
const multer = require('multer');
const uploadStocksResult = require('./uploadStocksResult');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post("/stocks-result", upload.single('file'), (req, res) => uploadStocksResult(req, res));

module.exports = router;