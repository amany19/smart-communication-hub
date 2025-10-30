import { Request, Response } from 'express';
import { AuthService } from '../services';
import {
  Route, Get, Post, Put, Delete,
  Tags,
} from 'tsoa';

@Route('auth')
@Tags('Auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  // POST /api/auth/login
 @Post('/login')
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const tokens = await this.authService.login(email, password);
      res.status(200).json(tokens);
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Login failed' });
    }
  }
 @Post('/refresh')
  // POST /api/auth/refresh
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
      }
      const tokens = await this.authService.refresh(refreshToken);
      res.status(200).json(tokens);
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Token refresh failed' });
    }
  }

  // POST /api/auth/logout
  @Post('/logout')
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      await this.authService.logout(userId);
      res.status(200).json({ message: 'Logout successful' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Logout failed' });
    }
  }
}
