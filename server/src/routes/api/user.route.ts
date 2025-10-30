import { Router } from 'express';
import { UserRepository } from '../../repositories/user.data';
import { UserService } from '../../services';
import { UserController } from '../../controllers';
 

// Create a new router instance
const router = Router();

// Instantiate repository → service → controller
const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

// Define endpoints
router.post('/register', userController.register);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
