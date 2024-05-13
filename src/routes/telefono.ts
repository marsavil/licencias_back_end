import  telefono  from '../controllers/telefono';
import { Router } from 'express';
const router = Router();

router.post('/', telefono.validacion);
router.post('/verify', telefono.verificacion)


export default router;