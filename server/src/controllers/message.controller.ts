import { Request, Response } from 'express';
import MessageService from '../services/message.service';

export default class MessageController {
    constructor(private messageService: MessageService) { }

    // POST /messages
    sendMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { sender_id, receiver_id, text } = req.body;
            if (!sender_id || !receiver_id || !text) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }

            const message = await this.messageService.sendMessage({
                sender_id,
                receiver_id,
                text,
                timestamp: new Date(),
            });

            res.status(201).json({ message: 'Message sent successfully', data: message });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // GET /messages/:id
    getMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const message = await this.messageService.getMessage(req.params.id);
            if (!message) {
                res.status(404).json({ error: 'Message not found' });
                return;
            }
            res.status(200).json(message);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // GET /messages/conversation/:senderId/:receiverId
    getConversation = async (req: Request, res: Response): Promise<void> => {
        try {
            const { senderId, receiverId } = req.params;
            const conversation = await this.messageService.getConversation(senderId, receiverId);
            res.status(200).json(conversation);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
    // PATCH /messages/:id
    editMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updates = req.body;

            const updatedMessage = await this.messageService.editMessage(id, updates);

            if (!updatedMessage) {
                res.status(404).json({ error: 'Message not found' });
                return;
            }

            res.status(200).json({
                message: 'Message updated successfully',
                data: updatedMessage,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    // DELETE /messages/:id
    deleteMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const success = await this.messageService.deleteMessage(req.params.id);
            if (!success) {
                res.status(404).json({ error: 'Message not found' });
                return;
            }
            res.status(200).json({ message: 'Message deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
