import express from "express";
import { PORT } from "./config/config.js";
import debug from "debug";
import usuarioRoute from "./routes/usuario.route.js";
import solicitudViajeRoute from "./routes/solicitudViaje.route.js";
import puntoEncuentroRoute from "./routes/puntoEncuentro.route.js";
import valoracionRoute from "./routes/valoracion.route.js";
import vehiculoRoute from "./routes/vehiculo.route.js";
import viajeRoute from "./routes/viaje.route.js";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(usuarioRoute);
app.use(solicitudViajeRoute);
app.use(puntoEncuentroRoute);
app.use(valoracionRoute);
app.use(vehiculoRoute);
app.use(viajeRoute);

app
    .listen(PORT, () => {
        debug("server on port ", PORT);
        console.log("Hola mundo devchallenege", PORT);
    })
    .on("error", (err) => {
        debug(err);
        process.exit();
    });