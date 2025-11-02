import { Router, Request, Response } from 'express';
import { AuthService } from '../../services';
import { AuthController } from '../../controllers';
import { UserRepository} from '../../repositories/user.repo';
import { RefreshTokenRepository} from '../../repositories/refreshToken.repo';

// ✅ Instantiate repositories
const userRepo = new UserRepository();
const refreshTokenRepo = new RefreshTokenRepository();

// ✅ Pass the repositories into the AuthService
const authService = new AuthService(userRepo, refreshTokenRepo);

// ✅ Instantiate controller (depends on the service)
const authController = new AuthController(authService);

// ✅ Initialize router
const router = Router();

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and issue tokens
 */
router.post('/login', (req: Request, res: Response) => authController.login(req, res));

/**
 * @route POST /api/auth/refresh
 * @desc Refresh expired access token using refresh token
 */
router.post('/refresh', (req: Request, res: Response) => authController.refresh(req, res));

/**
 * @route POST /api/auth/logout
 * @desc Revoke all refresh tokens for the user
 */
router.post('/logout', (req: Request, res: Response) => authController.logout(req, res));

export default router;
