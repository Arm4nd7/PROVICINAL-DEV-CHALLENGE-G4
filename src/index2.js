import express from 'express';
import {PORT} from './config.js';
import route from './routes/car.route.js';
import morgan from "morgan";

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(route);


app.listen(PORT)
console.log("server on port ", PORT);
console.log("Hola mundo devchallenege");