const express = require('express');
const mongoose = require('mongoose');
const routes = require("./src/router/index");
require('dotenv').config();

const app = express();

const port = 3000 || process.env.PORT;

app.use(express.json());

const mongoURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.9jgzm.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`;

const initDb = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');
    } catch (err) {
        console.error('Unable to connect to db', err);
    }
}

initDb();

app.use("/api/v1", routes);

app.listen(port, () => console.log(`Running on port ${port}`));