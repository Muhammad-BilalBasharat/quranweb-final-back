import express from 'express';
import {getWebContact, addWebContact, updateWebContact} from '../controllers/webContact.js';
import {verifyAdminByToken} from '../middlewares/verifyAdmin.js';
import verifyToken from '../middlewares/auth.js';
import validateId from '../middlewares/validateId.js';
const router = express.Router();

router.get('/web-contact', getWebContact);
router.post('/web-contact', verifyToken, verifyAdminByToken, addWebContact);
router.put('/web-contact/:id', verifyToken, verifyAdminByToken, validateId, updateWebContact);

export default router;
