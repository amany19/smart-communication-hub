import express from 'express';
import { MessageRepository } from '../../repositories';
import { MessageService } from '../../services';
import { MessageController } from '../../controllers';
import { authMiddleware } from '../../middlewares/auth.midleware';


const router = express.Router();

const messageRepo = new MessageRepository();
const messageService = new MessageService(messageRepo);
const messageController = new MessageController(messageService);

router.post('/', messageController.sendMessage);
router.get('/getMessage/:id', messageController.getMessage);
router.get('/conversation/:receiverId', messageController.getConversation);
router.get('/chats',authMiddleware, messageController.getChatList);
router.patch('/editMessage/:id', messageController.editMessage);
router.delete('/delete-message/:id', messageController.deleteMessage);

export default router;
