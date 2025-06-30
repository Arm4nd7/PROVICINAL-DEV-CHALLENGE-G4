import express from 'express';
import {PORT} from './config.js';
import route from './routes/usuario.route.js';
import routeSv from './routes/solicitudViaje.route.js';
import routePe from './routes/puntoEncuentro.route.js';
import routeVa from './routes/valoracion.route.js';
import routeVe from './routes/vehiculo.route.js';
import routeVi from './routes/viaje.route.js';
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(route);
app.use(routeSv);
app.use(routePe);
app.use(routeVa);
app.use(routeVe);
app.use(routeVi);


app.listen(PORT)
console.log("server on port ", PORT);
console.log("Hola mundo devchallenege");