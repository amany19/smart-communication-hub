import { Request, Response } from 'express';
import { UserService } from '../services';
 
export default class UserController {
  constructor(private userService: UserService) {}

  // POST /users/register
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.register(req.body);
      res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error: any) {
      res.status(400).json({
        error: error.message || 'Registration failed',
      });
    }
  };

  // GET /users/:id
  getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUser(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  // GET /
  getAllUsers= async (req: Request, res: Response): Promise<void> => {
    try {
   
      const users = await this.userService.getAllUsers();

      if (!users) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  // PUT /users/:id
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = await this.userService.updateUser(id, updates);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'User updated successfully',
        user,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  // DELETE /users/:id
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.userService.deleteUser(id);

      if (!success) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
