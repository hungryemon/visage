require("dotenv").config();
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import router from './router';

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080/');
})

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_URI, {
    dbName: process.env.DB_NAME,
}).then(() => {
    console.log("Connected MongoDB!");
}).catch(err => {
    console.log("ERROR: MongoDB Connection");
    console.log(err);
});
mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected!");
})
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());