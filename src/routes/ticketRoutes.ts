import { Router } from 'express';
import {
  createTicket,
  takeInWork,
  completeTicket,
  cancelTicket,
  getTickets,
  cancelAllInWork,
} from '../controllers/ticketController';

const router = Router();

router.post('/', createTicket);
router.put('/:id/work', takeInWork);
router.put('/:id/complete', completeTicket);
router.put('/:id/cancel', cancelTicket);
router.get('/', getTickets);
router.post('/cancel-all-in-work', cancelAllInWork);

export default router;