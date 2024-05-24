import { Router } from 'express';
import admin from './admin';
import licencias from './licencias';
import db from './db';
import empleados from './empleados';
import medicos from './medicos';
import sectores from './sectores';
import telefono from './telefono';
import sesion from './sesion';

const router = Router();
//aqui comenzare a definir las rutas
router.use("/db", db);
router.use("/licencia", licencias);
router.use("/admin", admin);
router.use('/empleados', empleados);
router.use('/medicos', medicos);
router.use('/sectores', sectores);
router.use('/telefono', telefono);
router.use('/sesion', sesion)


export default router;