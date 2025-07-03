import { Router } from "express";
// import { pool } from "../db.js";
import {
    createOne,
    readAll,
    readOne,
    updateOne,
    deleteOne,
} from "../controllers/viaje.controllers.js";

import {authenticateToken, authorizeRoles} from '../middlewares/auth.middlewares.js';


const router = Router();

router.post("/", authenticateToken, authorizeRoles(['pasajero']),createOne);

router.get("/", readAll);

router.get("/:id", readOne);

router.put("/:id", authenticateToken, authorizeRoles(['pasajero']) , updateOne);

router.delete("/:id", authenticateToken, authorizeRoles(['conductor']), deleteOne);

export default router;
