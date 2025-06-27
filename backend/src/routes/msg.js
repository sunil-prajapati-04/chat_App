import express from 'express';
import {jwtMiddleWare} from '../middleware/auth.middleware.js';
import {getUserForSidebar,getMessages,sendMessage} from '../controller/msg.controller.js';

const router = express.Router();



router.get('/users',jwtMiddleWare,getUserForSidebar);
router.get('/:id',jwtMiddleWare,getMessages);
router.post('/send/:id',jwtMiddleWare,sendMessage);

export default router;