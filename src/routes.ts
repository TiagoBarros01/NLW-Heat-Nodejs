import { Router } from 'express';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';

export const router = Router();

router.post('/authenticate', new AuthenticateUserController().handle);
