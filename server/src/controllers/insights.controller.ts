import { Request, Response } from "express";
import { insightService } from "../services";

class InsightsController {
    async analyze(req: Request, res: Response) {

        try {
            const { receiver_id } = req.body;
            const sender_id = req.user?.id
            if (!sender_id || !receiver_id) {
                return res.status(400).json({
                    error: "sender_id and receiver_id are required"
                });
            }

            const result = await insightService.analyzeAndStoreConversation(
                sender_id ,
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