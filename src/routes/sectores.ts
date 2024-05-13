import  sectores  from '../controllers/sectores';
import { Router } from 'express';
const router = Router();

router.post('/', sectores.cargar);
router.get('/', sectores.ver);
router.delete('/', sectores.eliminar)

export default router;