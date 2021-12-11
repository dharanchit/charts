const express = require('express');
const upload = require('../api/uploadStockData/index');

const app = express();

app.use("/upload", upload);

module.exports = app;