import  medicos  from '../controllers/medicos';
import { Router } from 'express';
const router = Router();

router.post('/', medicos.cargar);
router.get('/', medicos.ver);
router.delete('/', medicos.eliminar)

export default router;