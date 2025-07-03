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
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas de la API
app.use("/usuario", usuarioRoute);
app.use("/solicitud-viaje", solicitudViajeRoute);
app.use("/punto-encuentro", puntoEncuentroRoute);
app.use("/valoracion", valoracionRoute);
app.use("/vehiculo", vehiculoRoute);
app.use("/viaje", viajeRoute);

// Rutas para los formularios
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "formulario.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app
    .listen(PORT, () => {
        debug("server on port ", PORT);
        console.log("Hola mundo devchallenege", PORT);
    })
    .on("error", (err) => {
        debug(err);
        process.exit();
    });