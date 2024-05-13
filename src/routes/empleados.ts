import  empleados  from '../controllers/empleados';
import { Router } from 'express';
const router = Router();

router.post('/', empleados.cargar);
router.get('/', empleados.ver);
router.delete('/', empleados.eliminar);

export default router;