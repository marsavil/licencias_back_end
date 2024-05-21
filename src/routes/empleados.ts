import  empleados  from '../controllers/empleados';
import { Router } from 'express';
const router = Router();

router.post('/', empleados.cargar);
router.get('/', empleados.ver);
router.put('/', empleados.eliminar);

export default router;