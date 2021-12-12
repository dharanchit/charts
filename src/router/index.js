const express = require('express');
const upload = require('../api/uploadStockData/index');
const fetch = require('../api/stocksData/index');

const app = express();

app.use("/upload", upload);
app.use("/", fetch);

module.exports = app;