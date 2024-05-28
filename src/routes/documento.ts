import  documents  from '../controllers/documents';
import { Router } from 'express';
const router = Router();

router.get('/', documents.ver);


export default router;