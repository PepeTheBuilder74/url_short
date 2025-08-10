import { Router } from 'express';
import { createLink, listLinks, deleteLink } from '../controllers/linkController.js';
import { authMiddleware } from '../security/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.post('/', createLink);
router.get('/', listLinks);
router.delete('/:id', deleteLink);

export default router;
