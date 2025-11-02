import express from 'express';
import { MessageRepository } from '../../repositories';
import { MessageService } from '../../services';
import { MessageController } from '../../controllers';


const router = express.Router();

const messageRepo = new MessageRepository();
const messageService = new MessageService(messageRepo);
const messageController = new MessageController(messageService);

router.post('/', messageController.sendMessage);
router.get('/:id', messageController.getMessage);
router.get('/conversation/:senderId/:receiverId', messageController.getConversation);
router.get('/chats/:userId', messageController.getChatList);
router.patch('/:id', messageController.editMessage);
router.delete('/:id', messageController.deleteMessage);

export default router;
