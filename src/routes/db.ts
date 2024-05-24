import { Router } from 'express';
import charge from '../controllers/chargeDB';
const router = Router();

router.post('/', charge.chargeDB);
router.put('/update', charge.updateSectorsEmployees);

export default router;