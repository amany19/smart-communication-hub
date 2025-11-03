import { Request, Response } from "express";
import { insightService } from "../services"; // Lowercase 'i' to match instance

class InsightsController {
    async analyze(req: Request, res: Response) {

        try {
            const { sender_id, receiver_id } = req.body;

            if (!sender_id || !receiver_id) {
                return res.status(400).json({ 
                    error: "sender_id and receiver_id are required" 
                });
            }

            const result = await insightService.analyzeAndStoreConversation( // Lowercase 'i'
                sender_id,
                receiver_id
            );

            return res.status(200).json(result);

        } catch (error: any) {
            console.error("InsightsController error:", error.message);
            return res.status(500).json({ 
                error: "Failed to analyze conversation" 
            });
        }
    }
}

export const insightsController = new InsightsController();
export default insightsController;