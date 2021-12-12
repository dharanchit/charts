const express = require('express');
const fetchStockData = require('./fetchStockData');

const router = express.Router();

router.get("/stocks-result", (req, res) => fetchStockData(req, res));

module.exports = router;