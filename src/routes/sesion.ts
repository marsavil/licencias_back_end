import  sesion from '../controllers/sesion'
import { Router } from 'express';
const router = Router();

router.get('/login', sesion.login);

export default router;