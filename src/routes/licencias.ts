import  licencias  from '../controllers/licencias';
import { Router } from 'express';
const router = Router();

router.post('/', licencias.cargar);
router.get('/', licencias.ver);
router.put('/', licencias.evaluar);

export default router;