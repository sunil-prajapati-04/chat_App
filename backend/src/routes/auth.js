import express from 'express';

import {signup,login,logout, updateProfile,myProfile} from '../controller/auth.controller.js';
import {jwtMiddleWare} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
router.put('/update-profile',jwtMiddleWare,updateProfile);
router.get('/myProfile',jwtMiddleWare,myProfile);

export default router ;