import { Router } from "express";
// import { pool } from "../db.js";
import {
    createOne,
    readAll,
    readOne,
    updateOne,
    deleteOne,
} from "../controllers/usuario.controllers.js";

const router = Router();

router.post("/", createOne);

router.get("/", readAll);

router.get("/:id", readOne);

router.put("/:id", updateOne);

router.delete("/:id", deleteOne);

export default router;
