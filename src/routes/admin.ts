import  admin  from '../controllers/admin';
import { Router } from 'express';
const router = Router();

router.post('/', admin.cargar);
router.get('/', admin.ver);
//router.put('/', admin.desactivar);
//router.put('/', admin.activar);

export default router;